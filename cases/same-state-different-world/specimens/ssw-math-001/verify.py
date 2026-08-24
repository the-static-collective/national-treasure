#!/usr/bin/env python3
"""Verify the SSW-MATH-001 invariant-collision specimen."""
from __future__ import annotations

import argparse
import hashlib
import itertools
import json
import pathlib
import sys
from typing import Any


def _canonical_json(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def _canonical_edge(edge: list[int], vertices: set[int]) -> tuple[int, int]:
    if not isinstance(edge, list) or len(edge) != 2:
        raise ValueError("each edge must contain exactly two vertices")
    left, right = edge
    if left not in vertices or right not in vertices:
        raise ValueError("edge references an unknown vertex")
    if left == right:
        raise ValueError("self loops are not allowed")
    return (left, right) if left < right else (right, left)


def _graph(world: dict[str, Any]) -> dict[str, Any]:
    raw_vertices = world.get("vertices")
    if not isinstance(raw_vertices, list) or not raw_vertices:
        raise ValueError("world vertices must be a non-empty list")
    if any(not isinstance(vertex, int) for vertex in raw_vertices):
        raise ValueError("world vertices must be integers")
    if len(set(raw_vertices)) != len(raw_vertices):
        raise ValueError("world vertices must be unique")
    vertices = set(raw_vertices)
    raw_edges = world.get("edges")
    if not isinstance(raw_edges, list):
        raise ValueError("world edges must be a list")
    edges: set[tuple[int, int]] = set()
    for raw_edge in raw_edges:
        edge = _canonical_edge(raw_edge, vertices)
        if edge in edges:
            raise ValueError("duplicate undirected edge")
        edges.add(edge)
    adjacency = {vertex: set() for vertex in vertices}
    for left, right in edges:
        adjacency[left].add(right)
        adjacency[right].add(left)
    return {
        "vertices": tuple(sorted(vertices)),
        "edges": frozenset(edges),
        "adjacency": adjacency,
    }


def _component_count(graph: dict[str, Any]) -> int:
    unseen = set(graph["vertices"])
    count = 0
    while unseen:
        count += 1
        frontier = [unseen.pop()]
        while frontier:
            vertex = frontier.pop()
            for neighbor in graph["adjacency"][vertex]:
                if neighbor in unseen:
                    unseen.remove(neighbor)
                    frontier.append(neighbor)
    return count


def _properties(graph: dict[str, Any]) -> dict[str, Any]:
    degrees = sorted(len(graph["adjacency"][vertex]) for vertex in graph["vertices"])
    components = _component_count(graph)
    return {
        "vertex_count": len(graph["vertices"]),
        "edge_count": len(graph["edges"]),
        "degree_sequence": degrees,
        "component_count": components,
        "connected": components == 1,
        "all_degrees_even": all(degree % 2 == 0 for degree in degrees),
    }


def _isomorphic(left: dict[str, Any], right: dict[str, Any]) -> bool:
    if len(left["vertices"]) != len(right["vertices"]):
        return False
    if len(left["edges"]) != len(right["edges"]):
        return False
    if sorted(map(len, left["adjacency"].values())) != sorted(map(len, right["adjacency"].values())):
        return False
    for image in itertools.permutations(right["vertices"]):
        mapping = dict(zip(left["vertices"], image))
        mapped_edges = {
            tuple(sorted((mapping[first], mapping[second])))
            for first, second in left["edges"]
        }
        if mapped_edges == set(right["edges"]):
            return True
    return False


def _signature(properties: dict[str, Any], fields: list[str]) -> list[Any]:
    try:
        return [properties[field] for field in fields]
    except KeyError as exc:
        raise ValueError(f"unknown observation field {exc.args[0]!r}") from exc


def _reexpress(signature: list[Any], operation: str) -> Any:
    if operation == "canonical-json":
        return _canonical_json(signature)
    if operation == "labeled-vector":
        return {
            "n": signature[0],
            "m": signature[1],
            "degrees": signature[2],
        }
    raise ValueError(f"unknown re-expression operation {operation!r}")


def _predicate(properties: dict[str, Any], name: str) -> bool:
    if name == "all-degrees-even":
        return properties["all_degrees_even"]
    if name == "is-connected":
        return properties["connected"]
    raise ValueError(f"unknown discriminator predicate {name!r}")


def evaluate_case(case: dict[str, Any]) -> dict[str, Any]:
    if case.get("case_schema") != "ssw-math.case/v0":
        raise ValueError("case_schema must equal 'ssw-math.case/v0'")
    worlds = case.get("worlds")
    if not isinstance(worlds, list) or len(worlds) != 2:
        raise ValueError("SSW-MATH-001 requires exactly two worlds")
    world_ids = [world.get("id") for world in worlds]
    if any(not isinstance(world_id, str) or not world_id for world_id in world_ids):
        raise ValueError("each world needs a non-empty string id")
    if len(set(world_ids)) != len(world_ids):
        raise ValueError("world ids must be unique")

    graphs = {world["id"]: _graph(world) for world in worlds}
    properties = {world_id: _properties(graph) for world_id, graph in graphs.items()}
    observation = case.get("supplied_observation", {})
    fields = observation.get("fields")
    if not isinstance(fields, list) or not fields:
        raise ValueError("supplied_observation.fields must be a non-empty list")
    signatures = {world_id: _signature(result, fields) for world_id, result in properties.items()}
    expected = observation.get("expected_signature")
    if any(signature != expected for signature in signatures.values()):
        raise ValueError("computed observation does not match expected_signature")
    collision = len({_canonical_json(signature) for signature in signatures.values()}) == 1

    reexpression_results = []
    for reexpression in case.get("reexpressions", []):
        outputs = {
            world_id: _reexpress(signature, reexpression.get("operation"))
            for world_id, signature in signatures.items()
        }
        reexpression_results.append({
            "id": reexpression.get("id"),
            "outputs_equal": len({_canonical_json(output) for output in outputs.values()}) == 1,
        })

    def discriminator_result(specification: dict[str, Any]) -> dict[str, Any]:
        outputs = {
            world_id: _predicate(result, specification.get("predicate"))
            for world_id, result in properties.items()
        }
        if outputs != specification.get("expected_outputs"):
            raise ValueError(f"discriminator {specification.get('id')!r} output drift")
        return {
            "id": specification.get("id"),
            "cost": specification.get("cost"),
            "outputs": outputs,
            "separates": len(set(outputs.values())) == len(outputs),
        }

    discriminators = case.get("discriminators", {})
    failed = discriminator_result(discriminators.get("failed", {}))
    minimum = discriminator_result(discriminators.get("minimum", {}))
    minimum["zero_query_lower_bound"] = collision and minimum["cost"] == 1

    left_id, right_id = world_ids
    world_results = {
        world_id: {
            "observation_signature": signatures[world_id],
            **properties[world_id],
        }
        for world_id in world_ids
    }
    return {
        "receipt_schema": "ssw-math.receipt/v0",
        "specimen_id": case.get("specimen_id"),
        "case_digest": "sha256:" + hashlib.sha256(_canonical_json(case).encode("utf-8")).hexdigest(),
        "source_lineage": case.get("source_lineage"),
        "world_results": world_results,
        "observation_collision": collision,
        "isomorphic": _isomorphic(graphs[left_id], graphs[right_id]),
        "reexpression_results": reexpression_results,
        "failed_discriminator": failed,
        "minimum_discriminator": minimum,
        "identifiability": case.get("gold", {}).get("identifiability"),
        "conclusion": case.get("gold", {}).get("conclusion"),
        "scope_limitations": [
            "This result addresses distinguishability for the supplied pair and data only.",
            "The one-query minimum is relative to the declared Boolean-predicate cost model.",
        ],
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("case")
    parser.add_argument("--output")
    args = parser.parse_args(argv)
    case = json.loads(pathlib.Path(args.case).read_text(encoding="utf-8"))
    receipt = evaluate_case(case)
    rendered = json.dumps(receipt, ensure_ascii=False, indent=2, sort_keys=True) + "\n"
    if args.output:
        pathlib.Path(args.output).write_text(rendered, encoding="utf-8")
    else:
        sys.stdout.write(rendered)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

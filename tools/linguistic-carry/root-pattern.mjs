export function buildRootPatternGraph(entries = []) {
  const roots = new Map();
  const patterns = new Map();
  const edges = new Map();

  for (const entry of entries) {
    if (!entry.root || !entry.pattern || !entry.form) {
      throw new Error("each entry requires root, pattern, and form");
    }
    if (!roots.has(entry.root)) {
      roots.set(entry.root, { root: entry.root, forms: new Set(), patterns: new Set(), semantic_tags: new Set() });
    }
    if (!patterns.has(entry.pattern)) {
      patterns.set(entry.pattern, { pattern: entry.pattern, forms: new Set(), roots: new Set() });
    }
    const root = roots.get(entry.root);
    const pattern = patterns.get(entry.pattern);
    root.forms.add(entry.form);
    root.patterns.add(entry.pattern);
    for (const tag of entry.semantic_tags ?? []) root.semantic_tags.add(tag);
    pattern.forms.add(entry.form);
    pattern.roots.add(entry.root);
    const key = `${entry.root}::${entry.pattern}`;
    if (!edges.has(key)) edges.set(key, { root: entry.root, pattern: entry.pattern, forms: [] });
    edges.get(key).forms.push(entry.form);
  }

  const rootRows = [...roots.values()].map((row) => ({
    root: row.root,
    degree: row.patterns.size,
    form_count: row.forms.size,
    semantic_tag_count: row.semantic_tags.size,
    semantic_tags: [...row.semantic_tags].sort()
  })).sort((a,b) => a.root.localeCompare(b.root));

  const patternRows = [...patterns.values()].map((row) => ({
    pattern: row.pattern,
    degree: row.roots.size,
    form_count: row.forms.size
  })).sort((a,b) => a.pattern.localeCompare(b.pattern));

  const edgeRows = [...edges.values()].sort((a,b) =>
    `${a.root}:${a.pattern}`.localeCompare(`${b.root}:${b.pattern}`)
  );
  const possibleEdges = rootRows.length * patternRows.length;
  return {
    root_count: rootRows.length,
    pattern_count: patternRows.length,
    edge_count: edgeRows.length,
    bipartite_density: possibleEdges ? edgeRows.length / possibleEdges : 0,
    roots: rootRows,
    patterns: patternRows,
    edges: edgeRows,
    nonclaim:
      "Graph density describes only the supplied lexicon sample. It does not estimate the full language without a representative corpus."
  };
}

export function semanticNeighborhood(entries = [], root) {
  const matches = entries.filter((entry) => entry.root === root);
  const forms = [...new Set(matches.map((entry) => entry.form))];
  const tags = [...new Set(matches.flatMap((entry) => entry.semantic_tags ?? []))];
  return {
    root,
    forms,
    semantic_tags: tags.sort(),
    form_count: forms.length,
    tag_count: tags.length
  };
}

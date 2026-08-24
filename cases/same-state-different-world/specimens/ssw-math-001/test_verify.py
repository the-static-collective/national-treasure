import importlib.util
import json
import pathlib
import tempfile
import unittest


HERE = pathlib.Path(__file__).resolve().parent
VERIFY_PATH = HERE / "verify.py"
CASE_PATH = HERE / "case.json"


def load_verify():
    if not VERIFY_PATH.exists():
        raise AssertionError("verify.py must implement the SSW-MATH-001 witness")
    spec = importlib.util.spec_from_file_location("ssw_math_001_verify", VERIFY_PATH)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    if not hasattr(module, "evaluate_case"):
        raise AssertionError("verify.py must export evaluate_case(case)")
    return module


class SSWMath001Tests(unittest.TestCase):
    def setUp(self):
        self.case = json.loads(CASE_PATH.read_text(encoding="utf-8"))

    def test_worlds_collide_under_supplied_observation(self):
        verify = load_verify()
        receipt = verify.evaluate_case(self.case)
        expected = [6, 6, [2, 2, 2, 2, 2, 2]]
        self.assertEqual(expected, receipt["world_results"]["W_C6"]["observation_signature"])
        self.assertEqual(expected, receipt["world_results"]["W_2C3"]["observation_signature"])
        self.assertTrue(receipt["observation_collision"])

    def test_worlds_are_non_isomorphic(self):
        verify = load_verify()
        receipt = verify.evaluate_case(self.case)
        self.assertFalse(receipt["isomorphic"])
        self.assertEqual(1, receipt["world_results"]["W_C6"]["component_count"])
        self.assertEqual(2, receipt["world_results"]["W_2C3"]["component_count"])

    def test_deterministic_reexpressions_preserve_ambiguity(self):
        verify = load_verify()
        receipt = verify.evaluate_case(self.case)
        self.assertEqual(
            [
                {"id": "canonical-json", "outputs_equal": True},
                {"id": "labeled-vector", "outputs_equal": True},
            ],
            receipt["reexpression_results"],
        )

    def test_failed_discriminator_is_preserved(self):
        verify = load_verify()
        receipt = verify.evaluate_case(self.case)
        self.assertEqual(
            {"W_C6": True, "W_2C3": True},
            receipt["failed_discriminator"]["outputs"],
        )
        self.assertFalse(receipt["failed_discriminator"]["separates"])

    def test_connectedness_is_a_minimum_one_query_discriminator(self):
        verify = load_verify()
        receipt = verify.evaluate_case(self.case)
        self.assertEqual(1, receipt["minimum_discriminator"]["cost"])
        self.assertEqual(
            {"W_C6": True, "W_2C3": False},
            receipt["minimum_discriminator"]["outputs"],
        )
        self.assertTrue(receipt["minimum_discriminator"]["separates"])
        self.assertTrue(receipt["minimum_discriminator"]["zero_query_lower_bound"])

    def test_invalid_duplicate_edge_is_refused(self):
        verify = load_verify()
        bad = json.loads(json.dumps(self.case))
        bad["worlds"][0]["edges"].append([1, 0])
        with self.assertRaisesRegex(ValueError, "duplicate undirected edge"):
            verify.evaluate_case(bad)

    def test_native_receipt_avoids_foreign_constitutional_vocabulary(self):
        verify = load_verify()
        receipt = verify.evaluate_case(self.case)
        serialized = json.dumps(receipt, sort_keys=True).lower()
        for word in ("projection", "authority", "constitutes", "gate"):
            self.assertNotIn(word, serialized)

    def test_cli_output_is_deterministic(self):
        verify = load_verify()
        with tempfile.TemporaryDirectory() as directory:
            first = pathlib.Path(directory) / "first.json"
            second = pathlib.Path(directory) / "second.json"
            self.assertEqual(0, verify.main([str(CASE_PATH), "--output", str(first)]))
            self.assertEqual(0, verify.main([str(CASE_PATH), "--output", str(second)]))
            self.assertEqual(first.read_bytes(), second.read_bytes())


if __name__ == "__main__":
    unittest.main()

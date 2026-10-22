#!/usr/bin/env python3
"""Check initial DEMO shell labels against a running server (stdlib only).

Usage: python3 scripts/check-demo-labels.py http://127.0.0.1:3001
LIVE-mode behavior requires the browser checks recorded in evidence/issue-1/.
"""
import sys
import unittest
from html.parser import HTMLParser
from urllib.request import urlopen


class ShellText(HTMLParser):
    def __init__(self):
        super().__init__()
        self.depth = 0
        self.parts = []

    def handle_starttag(self, tag, attrs):
        if tag == "script":
            self.depth += 1

    def handle_endtag(self, tag):
        if tag == "script":
            self.depth -= 1

    def handle_data(self, data):
        if not self.depth:
            self.parts.append(data)


BASE = sys.argv.pop(1) if len(sys.argv) > 1 else "http://127.0.0.1:3001"


class DemoLabelTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with urlopen(BASE.rstrip("/") + "/dashboard", timeout=10) as response:
            parser = ShellText()
            parser.feed(response.read().decode())
        cls.text = " ".join(parser.parts)

    def test_initial_shell_clearly_labels_demo_metrics(self):
        self.assertIn("DEMO DATA", self.text)
        self.assertIn("Simulated threat", self.text)
        self.assertIn("Simulated uptime", self.text)
        self.assertIn("SIMULATED EVENTS", self.text)
        self.assertIn("SIMULATED AI CALL", self.text)
        self.assertIn("SIMULATED COST", self.text)
        self.assertIn("No actual AI calls or charges", self.text)


if __name__ == "__main__":
    unittest.main(verbosity=2)

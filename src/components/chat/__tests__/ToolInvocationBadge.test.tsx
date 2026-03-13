import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationBadge } from "../ToolInvocationBadge";

afterEach(() => cleanup());

test("shows 'Creating' label for str_replace_editor create command", () => {
  render(
    <ToolInvocationBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "/App.jsx" }}
      state="call"
    />
  );
  expect(screen.getByText("Creating App.jsx")).toBeDefined();
});

test("shows 'Editing' label for str_replace command", () => {
  render(
    <ToolInvocationBadge
      toolName="str_replace_editor"
      args={{ command: "str_replace", path: "/components/Button.tsx" }}
      state="call"
    />
  );
  expect(screen.getByText("Editing Button.tsx")).toBeDefined();
});

test("shows 'Editing' label for insert command", () => {
  render(
    <ToolInvocationBadge
      toolName="str_replace_editor"
      args={{ command: "insert", path: "/utils.ts" }}
      state="call"
    />
  );
  expect(screen.getByText("Editing utils.ts")).toBeDefined();
});

test("shows 'Reading' label for view command", () => {
  render(
    <ToolInvocationBadge
      toolName="str_replace_editor"
      args={{ command: "view", path: "/App.jsx" }}
      state="call"
    />
  );
  expect(screen.getByText("Reading App.jsx")).toBeDefined();
});

test("shows 'Undoing edit in' label for undo_edit command", () => {
  render(
    <ToolInvocationBadge
      toolName="str_replace_editor"
      args={{ command: "undo_edit", path: "/App.jsx" }}
      state="call"
    />
  );
  expect(screen.getByText("Undoing edit in App.jsx")).toBeDefined();
});

test("shows 'Renaming' label for file_manager rename command", () => {
  render(
    <ToolInvocationBadge
      toolName="file_manager"
      args={{ command: "rename", path: "/old.ts" }}
      state="call"
    />
  );
  expect(screen.getByText("Renaming old.ts")).toBeDefined();
});

test("shows 'Deleting' label for file_manager delete command", () => {
  render(
    <ToolInvocationBadge
      toolName="file_manager"
      args={{ command: "delete", path: "/unused.ts" }}
      state="call"
    />
  );
  expect(screen.getByText("Deleting unused.ts")).toBeDefined();
});

test("shows fallback label for unknown tool", () => {
  render(
    <ToolInvocationBadge
      toolName="unknown_tool"
      args={{}}
      state="call"
    />
  );
  expect(screen.getByText("Running unknown_tool")).toBeDefined();
});

test("shows green dot when state is result and result is present", () => {
  const { container } = render(
    <ToolInvocationBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "/App.jsx" }}
      state="result"
      result={{ success: true }}
    />
  );
  expect(container.querySelector(".bg-emerald-500")).toBeDefined();
  expect(container.querySelector(".animate-spin")).toBeNull();
});

test("shows spinner when state is not result", () => {
  const { container } = render(
    <ToolInvocationBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "/App.jsx" }}
      state="call"
    />
  );
  expect(container.querySelector(".animate-spin")).toBeDefined();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});

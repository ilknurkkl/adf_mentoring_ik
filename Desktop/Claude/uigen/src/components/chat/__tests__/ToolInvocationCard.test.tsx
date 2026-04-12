import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationCard } from "../ToolInvocationCard";

afterEach(() => {
  cleanup();
});

// str_replace_editor

test("shows Creating and filename for str_replace_editor create", () => {
  render(
    <ToolInvocationCard
      toolName="str_replace_editor"
      args={{ command: "create", path: "/components/Button.tsx" }}
      state="call"
    />
  );
  expect(screen.getByText("Creating")).toBeDefined();
  expect(screen.getByText("Button.tsx")).toBeDefined();
});

test("shows Editing and filename for str_replace_editor str_replace", () => {
  render(
    <ToolInvocationCard
      toolName="str_replace_editor"
      args={{ command: "str_replace", path: "/App.tsx" }}
      state="call"
    />
  );
  expect(screen.getByText("Editing")).toBeDefined();
  expect(screen.getByText("App.tsx")).toBeDefined();
});

test("shows Editing and filename for str_replace_editor insert", () => {
  render(
    <ToolInvocationCard
      toolName="str_replace_editor"
      args={{ command: "insert", path: "/src/index.tsx" }}
      state="call"
    />
  );
  expect(screen.getByText("Editing")).toBeDefined();
  expect(screen.getByText("index.tsx")).toBeDefined();
});

test("shows Reading and filename for str_replace_editor view", () => {
  render(
    <ToolInvocationCard
      toolName="str_replace_editor"
      args={{ command: "view", path: "/utils/helpers.ts" }}
      state="call"
    />
  );
  expect(screen.getByText("Reading")).toBeDefined();
  expect(screen.getByText("helpers.ts")).toBeDefined();
});

test("shows Undoing edit on and filename for str_replace_editor undo_edit", () => {
  render(
    <ToolInvocationCard
      toolName="str_replace_editor"
      args={{ command: "undo_edit", path: "/App.tsx" }}
      state="call"
    />
  );
  expect(screen.getByText("Undoing edit on")).toBeDefined();
  expect(screen.getByText("App.tsx")).toBeDefined();
});

// file_manager

test("shows Renaming with both filenames for file_manager rename", () => {
  render(
    <ToolInvocationCard
      toolName="file_manager"
      args={{ command: "rename", path: "/old.tsx", new_path: "/new.tsx" }}
      state="call"
    />
  );
  expect(screen.getByText("Renaming")).toBeDefined();
  expect(screen.getByText("old.tsx → new.tsx")).toBeDefined();
});

test("shows Deleting and filename for file_manager delete", () => {
  render(
    <ToolInvocationCard
      toolName="file_manager"
      args={{ command: "delete", path: "/components/Old.tsx" }}
      state="call"
    />
  );
  expect(screen.getByText("Deleting")).toBeDefined();
  expect(screen.getByText("Old.tsx")).toBeDefined();
});

// Unknown tool

test("falls back to tool name for unknown tools", () => {
  render(
    <ToolInvocationCard
      toolName="some_other_tool"
      args={{}}
      state="call"
    />
  );
  expect(screen.getByText("some_other_tool")).toBeDefined();
});

// State rendering

test("shows spinner when state is call", () => {
  const { container } = render(
    <ToolInvocationCard
      toolName="str_replace_editor"
      args={{ command: "create", path: "/App.tsx" }}
      state="call"
    />
  );
  expect(container.querySelector(".animate-spin")).toBeDefined();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});

test("shows green dot when state is result", () => {
  const { container } = render(
    <ToolInvocationCard
      toolName="str_replace_editor"
      args={{ command: "create", path: "/App.tsx" }}
      state="result"
    />
  );
  expect(container.querySelector(".bg-emerald-500")).toBeDefined();
  expect(container.querySelector(".animate-spin")).toBeNull();
});

test("extracts filename from deeply nested path", () => {
  render(
    <ToolInvocationCard
      toolName="str_replace_editor"
      args={{ command: "create", path: "/src/components/ui/Card.tsx" }}
      state="call"
    />
  );
  expect(screen.getByText("Card.tsx")).toBeDefined();
});

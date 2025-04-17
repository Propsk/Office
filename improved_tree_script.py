#!/usr/bin/env python3
"""
Improved directory tree script with better depth control and multiple focus folders.
"""

import os
import sys
import argparse
from typing import List, Optional

def print_tree(
    root: str, 
    indent: str = "", 
    current_depth: int = 0,
    max_depth: int = 2,
    focus_folders: Optional[List[str]] = None,
    exclude_dirs: Optional[List[str]] = None,
    exclude_patterns: Optional[List[str]] = None,
    in_focus_folder: bool = False
):
    """
    Prints the directory tree for `root` with advanced options:
      - Respects max_depth for regular folders
      - Focus folders will be fully explored regardless of depth
      - Exclude directories by exact path or pattern
      - Nicer formatting with proper branching
    """
    if exclude_dirs is None:
        exclude_dirs = []
    
    if exclude_patterns is None:
        exclude_patterns = [".git", "__pycache__", "venv", "env", "node_modules", ".pytest_cache"]
    
    if focus_folders is None:
        focus_folders = []
    
    # Convert focus folders to absolute paths
    focus_folders_abs = [os.path.abspath(f) for f in focus_folders]
    
    try:
        items = os.listdir(root)
        # Sort: directories first, then files
        dirs = [item for item in items if os.path.isdir(os.path.join(root, item))]
        files = [item for item in items if not os.path.isdir(os.path.join(root, item))]
        
        # Sort alphabetically within each group
        dirs.sort()
        files.sort()
        
        # Combine the sorted lists
        items = dirs + files
    except PermissionError:
        print(f"{indent}└── [Permission Denied]")
        return
    except FileNotFoundError:
        print(f"{indent}└── [Directory not found]")
        return
    
    # Skip empty directories
    if not items:
        return
    
    total = len(items)
    for index, item in enumerate(items):
        path = os.path.join(root, item)
        abs_path = os.path.abspath(path)
        
        # Skip excluded directories
        should_skip = False
        
        # Check if path exactly matches an excluded directory
        if any(os.path.abspath(ex_dir) == abs_path for ex_dir in exclude_dirs):
            should_skip = True
        
        # Check if item matches any exclude pattern
        if any(pattern in item for pattern in exclude_patterns):
            should_skip = True
        
        if should_skip:
            continue
        
        # Determine if this is the last item for branch styling
        is_last = index == total - 1
        branch = "└── " if is_last else "├── "
        next_indent = indent + ("    " if is_last else "│   ")
        
        # Print the current item
        print(f"{indent}{branch}{item}")
        
        # If it's a directory, decide if we should recurse
        if os.path.isdir(path):
            # Check if this is a focus folder
            path_is_focus = abs_path in focus_folders_abs
            
            # Determine whether to recurse based on depth and focus
            should_recurse = (
                (current_depth < max_depth) or  # Not too deep yet
                path_is_focus or                # This is a focus folder
                in_focus_folder                 # Already inside a focus folder
            )
            
            if should_recurse:
                print_tree(
                    path, 
                    next_indent, 
                    current_depth + 1,
                    max_depth,
                    focus_folders,
                    exclude_dirs,
                    exclude_patterns,
                    in_focus_folder=in_focus_folder or path_is_focus
                )

def main():
    parser = argparse.ArgumentParser(description="Generate a directory tree with advanced options")
    parser.add_argument("--root", default=os.getcwd(), help="Root directory to start from")
    parser.add_argument("--depth", type=int, default=2, help="Maximum depth for regular folders")
    parser.add_argument("--focus", nargs="*", default=[], help="Folders to explore completely")
    parser.add_argument("--exclude", nargs="*", default=[], help="Directories to exclude")
    parser.add_argument("--exclude-patterns", nargs="*", help="Patterns to exclude (defaults include common ones)")
    
    args = parser.parse_args()
    
    # If no explicit exclude patterns provided, use the defaults
    exclude_patterns = args.exclude_patterns
    if exclude_patterns is None:
        exclude_patterns = [".git", "__pycache__", "venv", "env", "node_modules", ".pytest_cache"]
    
    # Print the root folder first
    print(args.root)
    
    # Print the tree
    print_tree(
        args.root,
        max_depth=args.depth,
        focus_folders=args.focus,
        exclude_dirs=args.exclude,
        exclude_patterns=exclude_patterns
    )

if __name__ == "__main__":
    # Example usage from command line:
    # python improved_tree_script.py --root "/path/to/directory" --depth 3 --focus "important_folder" "another_folder"
    
    # Default usage when no arguments provided:
    if len(sys.argv) == 1:
        root_directory = r"C:\Users\sajid\Rent-Property"
        focus_folders = [
            os.path.join(root_directory, "app"),
            os.path.join(root_directory, "components"),
            os.path.join(root_directory, "models")
        ]
        
        print(root_directory)
        print_tree(
            root_directory, 
            max_depth=3,
            focus_folders=focus_folders
        )
    else:
        main()
#!/usr/bin/env python3
"""
Recursive Folder and File Lister
Lists all directories and files in a tree structure with detailed information
"""

import os
import sys
from pathlib import Path
from datetime import datetime

def format_size(size_bytes):
    """Convert bytes to human readable format"""
    if size_bytes == 0:
        return "0 B"
    
    size_names = ["B", "KB", "MB", "GB", "TB"]
    import math
    i = int(math.floor(math.log(size_bytes, 1024)))
    p = math.pow(1024, i)
    s = round(size_bytes / p, 2)
    return f"{s} {size_names[i]}"

def get_file_info(file_path):
    """Get detailed file information"""
    try:
        stat = file_path.stat()
        return {
            'size': stat.st_size,
            'modified': datetime.fromtimestamp(stat.st_mtime).strftime('%Y-%m-%d %H:%M:%S'),
            'is_file': file_path.is_file(),
            'is_dir': file_path.is_dir()
        }
    except (OSError, PermissionError):
        return {
            'size': 0,
            'modified': 'Unknown',
            'is_file': False,
            'is_dir': False
        }

def list_directory_tree(root_path, show_hidden=False, show_sizes=True, show_dates=False, max_depth=None, current_depth=0):
    """
    Recursively list directory contents in tree format
    
    Args:
        root_path: Path to start listing from
        show_hidden: Include hidden files/folders (starting with .)
        show_sizes: Show file sizes
        show_dates: Show modification dates
        max_depth: Maximum depth to recurse (None for unlimited)
        current_depth: Current recursion depth (internal)
    """
    
    if max_depth is not None and current_depth >= max_depth:
        return {"dirs": 0, "files": 0, "total_size": 0}
    
    try:
        root = Path(root_path)
        if not root.exists():
            print(f"❌ Path does not exist: {root_path}")
            return {"dirs": 0, "files": 0, "total_size": 0}
        
        # Collect all entries
        entries = []
        for item in root.iterdir():
            if not show_hidden and item.name.startswith('.'):
                continue
            
            info = get_file_info(item)
            entries.append((item, info))
        
        # Sort: directories first, then files, both alphabetically
        entries.sort(key=lambda x: (not x[1]['is_dir'], x[0].name.lower()))
        
        stats = {"dirs": 0, "files": 0, "total_size": 0}
        
        for i, (item, info) in enumerate(entries):
            is_last = i == len(entries) - 1
            
            # Create tree characters
            if current_depth == 0:
                prefix = ""
                child_prefix = ""
            else:
                prefix = "└── " if is_last else "├── "
                child_prefix = "    " if is_last else "│   "
            
            # Format item name with details
            item_display = item.name
            
            if info['is_dir']:
                item_display = f"📁 {item_display}/"
                stats["dirs"] += 1
            else:
                item_display = f"📄 {item_display}"
                stats["files"] += 1
                stats["total_size"] += info['size']
            
            # Add size information
            details = []
            if show_sizes:
                if info['is_file']:
                    details.append(format_size(info['size']))
                elif info['is_dir']:
                    # Calculate directory size
                    try:
                        dir_size = sum(f.stat().st_size for f in item.rglob('*') if f.is_file())
                        details.append(f"({format_size(dir_size)})")
                    except (OSError, PermissionError):
                        details.append("(size unknown)")
            
            if show_dates:
                details.append(info['modified'])
            
            detail_str = f" [{', '.join(details)}]" if details else ""
            
            print(f"{'    ' * current_depth}{prefix}{item_display}{detail_str}")
            
            # Recurse into subdirectories
            if info['is_dir'] and (max_depth is None or current_depth < max_depth - 1):
                try:
                    child_stats = list_directory_tree(
                        item, show_hidden, show_sizes, show_dates, 
                        max_depth, current_depth + 1
                    )
                    stats["dirs"] += child_stats["dirs"]
                    stats["files"] += child_stats["files"]
                    stats["total_size"] += child_stats["total_size"]
                except PermissionError:
                    print(f"{'    ' * (current_depth + 1)}├── ❌ Permission denied")
                except Exception as e:
                    print(f"{'    ' * (current_depth + 1)}├── ❌ Error: {e}")
        
        return stats
        
    except PermissionError:
        print(f"❌ Permission denied: {root_path}")
        return {"dirs": 0, "files": 0, "total_size": 0}
    except Exception as e:
        print(f"❌ Error processing {root_path}: {e}")
        return {"dirs": 0, "files": 0, "total_size": 0}

def main():
    """Main function with command line argument handling"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='Recursively list folders and files in tree format',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python folder_lister.py .                    # List current directory
  python folder_lister.py /path/to/folder      # List specific folder
  python folder_lister.py . --hidden           # Include hidden files
  python folder_lister.py . --no-sizes         # Hide file sizes
  python folder_lister.py . --dates            # Show modification dates
  python folder_lister.py . --depth 2          # Limit to 2 levels deep
  python folder_lister.py . --filter "*.py"    # Only show Python files
        """
    )
    
    parser.add_argument(
        'path', 
        nargs='?', 
        default='.', 
        help='Path to list (default: current directory)'
    )
    
    parser.add_argument(
        '--hidden', 
        action='store_true', 
        help='Include hidden files and folders'
    )
    
    parser.add_argument(
        '--no-sizes', 
        action='store_true', 
        help='Hide file sizes'
    )
    
    parser.add_argument(
        '--dates', 
        action='store_true', 
        help='Show modification dates'
    )
    
    parser.add_argument(
        '--depth', 
        type=int, 
        help='Maximum depth to recurse'
    )
    
    parser.add_argument(
        '--filter',
        help='Filter files by pattern (e.g., "*.py", "*.md")'
    )
    
    args = parser.parse_args()
    
    # Resolve the path
    target_path = Path(args.path).resolve()
    
    print("📂 Recursive Directory Listing")
    print("=" * 50)
    print(f"📍 Path: {target_path}")
    print(f"🕒 Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    if args.depth:
        print(f"📏 Max depth: {args.depth}")
    if args.hidden:
        print("👁️ Including hidden files")
    if args.dates:
        print("📅 Showing dates")
    if not args.no_sizes:
        print("📊 Showing sizes")
    if args.filter:
        print(f"🔍 Filter: {args.filter}")
    
    print("=" * 50)
    print()
    
    # Special handling for root display
    if target_path.is_file():
        info = get_file_info(target_path)
        details = []
        if not args.no_sizes:
            details.append(format_size(info['size']))
        if args.dates:
            details.append(info['modified'])
        detail_str = f" [{', '.join(details)}]" if details else ""
        print(f"📄 {target_path.name}{detail_str}")
        print("\n📊 Summary: 1 file")
        return
    
    # List the directory
    print(f"📁 {target_path.name}/")
    
    stats = list_directory_tree(
        target_path,
        show_hidden=args.hidden,
        show_sizes=not args.no_sizes,
        show_dates=args.dates,
        max_depth=args.depth
    )
    
    # Print summary
    print()
    print("=" * 50)
    print("📊 Summary:")
    print(f"   📁 Directories: {stats['dirs']:,}")
    print(f"   📄 Files: {stats['files']:,}")
    if not args.no_sizes and stats['total_size'] > 0:
        print(f"   💾 Total size: {format_size(stats['total_size'])}")

def quick_list(path='.', depth=None):
    """Quick function for interactive use"""
    stats = list_directory_tree(path, max_depth=depth, show_sizes=True)
    print(f"\nSummary: {stats['dirs']} dirs, {stats['files']} files, {format_size(stats['total_size'])}")

if __name__ == "__main__":
    main()
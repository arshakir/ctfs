---
title: Debuggable-1

published: 2025-06-14

description: GDB Exploit

tags: [pwn, gdb, c]

category: SmileyCTF 2025
---

# Debuggable-1

> AAAAAAAAAAAAAAAAAAAAAAAAA

## Files

looking at our files we have

```
Dockerfile
run.py
```
The dockerfile isn't really important just makes linux container with the flag at `/app/flag.txt`

In run.py we can see that the instance takes in an base64 encoded ELF file loads into gdb and runs the following commands
```
list /app/flag.txt
q
```

## Approach

When compiling a program with `-g` the path to the source code is embedded in the binary

We can exploit this by directly changing the source path and source file name, making gdb list the contents of `/app/flag.txt`

However, `list` in gdb only works on functions, so we just have to make a function `/app/flag.txt`.

This will make gdb list the source code of the file, which we have set to `/app/flag.txt` giving us the flag

## Solution

First we write a basic c program called sol123.c:
```c
#include <stdio.h>
void dummy12345678(){}
int main(){}
```

Next we compile with `gcc -g sol123.c -fdebug-prefix-map=$(pwd)=/app`. The `-fdebug-prefix-map` makes it so in our debug into it looks like our program was compiled from `/app`

Then we change the first `sol123.c` in our binary to `flag.txt` using sed or any file editor. We do the same for `dummy12345678` to `/app/flag.txt`

For this to work that the names that we change must be the same length or it will mess up the binary

Now we convert our binary into base64 and send it to the instance giving us the flag 

`.;,;.{elves_dwarves_orcs_what_is_going_to_be_next}`

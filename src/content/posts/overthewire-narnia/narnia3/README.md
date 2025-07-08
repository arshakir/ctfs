---
title: Narnia3

published: 2025-06-19

description: Buffer overflow file names

tags: [pwn, buffer overflow]

category: overthewire-narnia
---

# Narnia 3

## C File

```c
int main(int argc, char **argv){

    int  ifd,  ofd;
    char ofile[16] = "/dev/null";
    char ifile[32];
    char buf[32];

    if(argc != 2){
        printf("usage, %s file, will send contents of file 2 /dev/null\n",argv[0]);
        exit(-1);
    }

    /* open files */
    strcpy(ifile, argv[1]);
    if((ofd = open(ofile,O_RDWR)) < 0 ){
        printf("error opening %s\n", ofile);
        exit(-1);
    }
    if((ifd = open(ifile, O_RDONLY)) < 0 ){
        printf("error opening %s\n", ifile);
        exit(-1);
    }

    /* copy from file1 to file2 */
    read(ifd, buf, sizeof(buf)-1);
    write(ofd,buf, sizeof(buf)-1);
    printf("copied contents of %s to a safer place... (%s)\n",ifile,ofile);

    /* close 'em */
    close(ifd);
    close(ofd);

    exit(1);
}
```


## Approach

Again we another unsafe `strcpy`, but this time we can't rewrite the return address since they are using `exit`

What we can do though is overwrite the `ofile` to whatever we want

The only problem is that our `ifile` will have to be a string + contents of ofile, or `ofile` is the substring of `ifile` after 32 chars 

## Solution

```sh
/narnia/narnia3 /tmp/tmp.3TVcyK0aB0/hello123456/pass
```

When we do this our `ifile` becomes `/tmp/tmp.3TVcyK0aB0/hello123456/pass` and our `ofile` becomes `pass`

Now we just make a symbolic link from `/tmp/tmp.3TVcyK0aB0/hello123456/pass` to `/etc/narnia_pass/narnia4`, and keep an empty local file called `pass`

Now when the code runs it will copy the contents of the password into our local pass file

We open up our file, grab the password, and move on

## Conclusion

Again be careful with `strcpy` as its an easy way to cause a buffer overflow

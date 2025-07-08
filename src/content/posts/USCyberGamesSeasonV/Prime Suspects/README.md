---
title: Prime Suspects

published: 2025-06-18

description: Decrypt the RSA message

tags: [RSA, Small Primes, Crypto]

category: US Cyber Games Season V
---

# Prime Suspects
> The suspect encrypted a message using a suspiciously weak RSA setup. Can you uncover what they were trying to hide?

> We've recovered the following:

> > n = 102064367305175623005003367803963735992210717721719563218760598878897771063019 e = 65537 c = 66538583650087752653364112099322882026083260207958188191147900019851853145222

## Decrypting

First we look up n on [factor.db](https://factordb.com/) and we find out that it already factored

Since `n=p*q`, This gives us `p=305875545128432734240552595430305723491` and `q=333679396508538352589365351078683227609`

If we have both `p` and `q` we can easily decrypt our message `c`

Now we can just look up any RSA decrypter and get our flag by plugging in our values: `SVUSCG{sm4ll_pr1m3s}` 

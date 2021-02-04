# liftd

CLI utility to help you keep your javascript dependencies up to date with `yarn`.

![liftd in use](https://user-images.githubusercontent.com/5926102/106904203-82d9d500-66c0-11eb-8888-85a6735faa9d.png)

## Features

- Works with `yarn`
- Automatically updates your packages by running `yarn outdated` and `yarn upgrade` shell commands

## Motivation

I would usually use an automated tool like [renovatebot](https://github.com/renovatebot/renovate) to upgrade my
packages, I prefer it since it's platform agnostic unlike dependabot. But sometimes for smaller projects it's an
overkill solution, so I'd rather have a tool that makes it easier for me to select which dependencies I want to
update. I checked [yarn-check](https://github.com/yhnavein/yarn-check) but it's kinda dead. The purpose for `liftd` is
not to compete with other tools but to be a simple alternative.

After git pull:

```shell
npm install --workspaces
npx lerna version 0.0.6 --no-push --no-git-tag-version
```

And you will stuck at

```
lerna notice cli v6.5.1
lerna info current version 0.0.0
lerna notice FYI git repository validation has been skipped, please ensure your version bumps are correct
lerna info Looking for changed packages since v0.0.5
lerna WARN version Skipping working tree validation, proceed at your own risk

Changes:
 - a: 0.0.5 => 0.0.6
 - b: 0.0.1 => 0.0.6

? Are you sure you want to create these versions? Yes
lerna info execute Skipping git tag/commit
lerna info execute Skipping git push
lerna info execute Skipping releases
^C
```

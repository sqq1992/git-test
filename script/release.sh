#!/bin/bash
set -e

git_status_short=$(git status -s)

if [ ! $git_status_short ]; then
  git_status=$(git status);
  git_status_newest="Your branch is up-to-date with";
  git_status_newest_two="Your branch is up to date with";

  if [[ $git_status =~ $git_status_newest || $git_status =~ $git_status_newest_two ]]; then

      npm run buildMaster

      export log=$(git log -1 --pretty=format:"%s --change by %an")

      get_branch=$(git symbolic-ref --short -q HEAD)

      git checkout test

      git pull origin test

      ls -a |grep -vE "^\.|^dist|^node_modules|^script"|xargs rm -r

      cp -rf ./dist/* .

      git add .

      git commit -m "${log}" || true

      git push origin test

      git checkout "${get_branch}" || master

  else
      echo "含有未push的commit"
      echo $git_status
  fi
else
  echo "The project has changed, please git commit."
fi

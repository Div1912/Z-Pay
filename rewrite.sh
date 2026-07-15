#!/bin/sh

git filter-branch -f --env-filter '
OLD_EMAIL="Sristipriya@users.noreply.github.com"
CORRECT_NAME="Div1912"
CORRECT_EMAIL="Div1912@users.noreply.github.com"

if [ "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL" ] || [ "$GIT_AUTHOR_NAME" = "Sristipriya" ]
then
    export GIT_COMMITTER_NAME="$CORRECT_NAME"
    export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
    export GIT_AUTHOR_NAME="$CORRECT_NAME"
    export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
fi
' --tag-name-filter cat -- --branches --tags

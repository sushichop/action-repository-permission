# action-repository-permission

[![release](https://img.shields.io/github/v/release/sushichop/action-repository-permission.svg?color=blue)](https://github.com/sushichop/action-repository-permission/releases)
![CI](https://github.com/sushichop/action-repository-permission/workflows/CI/badge.svg)
[![codecov](https://codecov.io/gh/sushichop/action-repository-permission/branch/main/graph/badge.svg)](https://codecov.io/gh/sushichop/action-repository-permission)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/sushichop/action-repository-permission/blob/main/LICENSE)

Check repository permission for a user **flexibly**.

## Usage

```yaml
on
  issue_comment:
    types:
      - created
jobs:
  steps:
    - name: Check repository permission for user
      id: permission
      uses: sushichop/action-repository-permission@v1
      with:
        required-permission: write
    - name: Display information about permission
      run: |
        echo "A user trying to access is permitted"
        echo "An actual permission was '${{ steps.permission.outputs.actual-permission }}'"
```

You can set `none`, `read`, `write`, or `admin` to `required-permission`. In this action, the permission of a user trying to access the repository is named `actual-permission`.

This action uses [GitHub API](https://docs.github.com/en/rest/reference/repos#get-repository-permissions-for-a-user) internally and sets `permitted` to true and returns 0 as exit code when `actual-permission` is equal or greater than `required-permission`.

Furthermore, you can also control various things flexibly according to the condition.

 - Add a reaction to user's comment
 - Add an issue comment
 - Change the exit code(Relax repository permission check)

See [action.yml](action.yml) and [Cheat Sheet](#Cheat-Sheet) for details.

## Good Example

```yaml
on
  issue_comment:
    types:
      - created
jobs:
  danger-for-external:
    name: Danger for external - node.js 12.x
    if: |
      github.event_name == 'issue_comment' && github.event.action == 'created'
      && github.event.issue.pull_request != null && startsWith(github.event.comment.body, '/danger')
    runs-on: ubuntu-latest
    steps:
    - name: Check repository permission for user
      uses: sushichop/action-repository-permission@v1
      with:
        required-permission: write
        reaction-permitted: rocket
        comment-not-permitted: Sorry, you don't have enough permission to execute `/danger`...
    - name: Clone the PR source
      uses: actions/checkout@v2
      with:
        ref: refs/pull/${{ github.event.issue.number }}/head
    - uses: actions/setup-node@v1
      with:
        node-version: 12.x
    - name: Danger JS
      run: npx danger ci
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

The above is a good example to execute [danger](https://danger.systems) as an issue comment for the pull request from the fork.

This action permits the only authorized users to execute `danger`.

**As a matter of fact, I created `action-repository-permission` to achieve this!**

## Cheat Sheet

### reaction-permitted

- Add a [reaction](https://docs.github.com/en/rest/reference/reactions#reaction-types) to user's comment(if it exists) when he/she is permitted.

| reaction-permitted (input) | permitted (output) | issue comment (what you can expect)           |
|:---------------------------|:-------------------|:----------------------------------------------|
| valid value is not set     | true               | `reaction-permitted` is not added as reaction |
| valid value is not set     | false              | `reaction-permitted` is not added as reaction |
| **valid value is set**     | **true**           | **`reaction-permitted` is added as reaction** |
| valid value is set         | false              | `reaction-permitted` is not added as reaction |

### reaction-not-permitted

- Add a [reaction](https://docs.github.com/en/rest/reference/reactions#reaction-types) to user's comment(if it exists) when he/she is not permitted.

| reaction-not-permitted (input) | permitted (output) | issue comment (what you can expect)               |
|:-------------------------------|:-------------------|:--------------------------------------------------|
| valid value is not set         | true               | `reaction-not-permitted` is not added as reaction |
| valid value is not set         | false              | `reaction-not-permitted` is not added as reaction |
| valid value is set             | true               | `reaction-not-permitted` is not added as reaction |
| **valid value is set**         | **false**          | **`reaction-not-permitted` is added as reaction** |

### comment-permitted

- Add an issue comment when a user is permitted.

| comment-permitted (input)          | permitted (output) | issue comment (what you can expect)               |
|:-----------------------------------|:-------------------|:--------------------------------------------------|
| value is not set(or empty string)  | true               | `comment-permitted` is not added as issue comment |
| value is not set(or empty string)  | false              | `comment-permitted` is not added as issue comment |
| **value is set(not empty string)** | **true**           | **`comment-permitted` is added as issue comment** |
| value is set(not empty string)     | false              | `comment-permitted` is not added as issue comment |

### comment-not-permitted

- Add an issue comment added when a user is permitted.

| comment-not-permitted (input)      | permitted (output) | issue comment (what you can expect)                   |
|:-----------------------------------|:-------------------|:------------------------------------------------------|
| value is not set(or empty string)  | true               | `comment-not-permitted` is not added as issue comment |
| value is not set(or empty string)  | false              | `comment-not-permitted` is not added as issue comment |
| value is set(not empty string)     | true               | `comment-not-permitted` is not added as issue comment |
| **value is set(not empty string)** | **false**          | **`comment-not-permitted` is added as issue comment** |

### relax

- Change the exit code (Relax repository permission check).

| relax (input) | permitted (output) | exit code (what you can expect) |
|:--------------|:-------------------|:--------------------------------|
| false         | true               | 0 (success)                     |
| false         | false              | 1 (failure)                     |
| true          | true               | 0 (success)                     |
| **true**      | **false**          | **0 (success)**                 |


## License

[MIT]: http://www.opensource.org/licenses/mit-license

**action-repository-permission** is available under the [MIT license][MIT]. See the LICENSE file for details.

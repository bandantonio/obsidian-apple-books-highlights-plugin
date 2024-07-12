# Contributing Guide

Thank you for investing your time in contributing to the project! I, as the code owner, really appreciates it! 🩷

First, read the [Code of Conduct](./CODE_OF_CONDUCT.md) to keep our community approachable and respectable.

## How Can I Contribute?

### 🐛 Reporting Bugs

If you spot a problem with the plugin, [search if an issue already exists][issue-bug]. If a related issue doesn't exist, you can open a new issue using the corresponding bug report form. Please provide as much information as possible (including screenshots and error messages) about the issue and how to reproduce it.

### 🛠️ Resolving Issues

Scan through the [existing issues][issue-bug] to find one that interests you. As a general rule, issues are not assigned to anyone. If you find an issue to work on, you are welcome to open a PR with a fix.

### 💡 Suggesting Enhancements

If you have an idea to improve the plugin, [search if someone else has already suggested it][issue-enhancement]. If a related issue doesn't exist, you can open a new issue using the corresponding enhancement request form. Please provide as much detail as possible about your suggestion.

### 📚 Updating Documentation

If you've found something in the documentation that should be updated, [search open issues][issue-doc] to see if someone else has reported the same thing. If it's something new, open an issue using the corresponding template. Issues are used to have a conversation about the problem you want to fix. If you want to fix it yourself, you are welcome to proceed with a PR.

[issue-bug]: https://github.com/bandantonio/obsidian-apple-books-highlights-plugin/issues?q=is%3Aopen+is%3Aissue+label%3Abug
[issue-enhancement]: https://github.com/bandantonio/obsidian-apple-books-highlights-plugin/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement
[issue-doc]: https://github.com/bandantonio/obsidian-apple-books-highlights-plugin/issues?q=is%3Aopen+is%3Aissue+label%3Adocumentation

## Getting Started

### Issues

Use the instructions in the section above to find an issue that you want to work on.

### Make changes

1. Fork the repository.
2. Create a new branch. Stick to the following naming convention:

	```
	<type>/<short-summary-of-your-changes>
	```
	where `<type>` is one of the following:
	- `feat`
	- `fix`
	- `docs`
	- `test`
	- `chore`
	- `refactor`

3. Make your changes.
	- If your changes are related to the plugin's functionality, make sure to write the required tests, and (yes!) make sure they pass.

> [!IMPORTANT]
> Please, don't change the plugin's version either in the `manifest.json` or `package.json` files. This may lead to conflicts when merging your PR and disrupt the release process. The version will be updated by the code owner.

## Commit changes

Commit the changes once you are happy with them. Stick to the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification when writing your commit messages:

```
<type>: <short-summary-of-your-changes>

<optional detailed description of your changes>
```

You may want to check `git log` to see the commit history and get an idea of how to properly write your commit messages.

> [!IMPORTANT]
> The repository uses git pre-commit hook to launch linter and tests before every commit. If the tests fail, the commit will be rejected. The only valid reason to skip the pre-commit check is when your changes only affect the README file.

## Push changes

Push the changes to your fork.

## Pull request

6. When you're finished with the changes, create a pull request (PR) to the `master` branch of the upstream repository.
	- Don't forget to link PR to issue, if you are solving one. You can do this by adding `Fixes #<issue-number>` to the PR description.
	- Enable the checkbox to allow maintainer edits so the branch can be updated for a merge.
	- Once you submit your PR, the code owner will review your proposal.
		- If you're the first-time contributor, your PR will require approval before the CI checks will be triggered.
		- If not, the CI checks will be triggered automatically.
	- During the review, please be ready to answer questions about your changes and provide additional information if needed.
	- You may be asked for changes to be made before your PR can be merged, either using suggested changes or pull request comments.
	- As you update your PR and apply changes, mark each conversation as resolved.
	- After your changes are approved, you can merge your PR.
		- Make sure to resolve all the conflicts before merging the PR.

## Your PR is merged!

Congratulations 🎉🎉 The code owner thanks you ✨.

Once your PR is merged, your contributions will eventually become a part of a new public release and will be available to the plugin's users.

Happy to have you on board 🚀 and waiting for your new contributions!

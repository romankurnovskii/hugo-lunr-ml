# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 2.2.1 (2022-10-01)

- Updated all dependencies

# 2.1.0 (2022-08-27)

### Features

- Generate stringified lunr-index. 

*Now no need to create index every time on search request. Just need to fetch lunr-index.
Index generation for 100.000 pages took 2min *once* during build. Search of popular query takes < 0.3sec*

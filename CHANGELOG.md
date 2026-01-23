# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 3.2.7 (2026-01-22)

- Added support for 23 additional languages (ar, da, de, el, es, fi, fr, he, hi, hu, hy, it, ja, kn, ko, nl, no, pt, ro, ru, sv, ta, te, th, tr, vi, zh).
- Improved CLI option naming (`-L` for output lunr index).
- Refactored codebase to use async/await.
- Fixed `commander` usage and missing dependencies.
- Added segmentation support for Chinese and Thai.
- Fixed linting errors.

## 3.0.1 (2023-02-04)

- Fix multilanguage support
- Updated all dependencies
- Test coverage

## 2.2.1 (2022-10-01)

- Updated all dependencies

## 2.1.0 (2022-08-27)

### Features

- Generate stringified lunr-index.

*Now no need to create index every time on search request. Just need to fetch lunr-index.
Index generation for 100.000 pages took 2min *once* during build. Search of popular query takes < 0.3sec*

## 2.0.1

Creates stringified lunr-index. Now no need to create index every time on search request. Just need to fetch lunr-index.
Index generation for 100.000 pages took 2min _once_ during build. Search of popular query takes < 0.3sec

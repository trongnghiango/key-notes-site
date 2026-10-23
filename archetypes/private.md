---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
description: "Private note"
date: {{ .Date }}
private: true
draft: false
build:
  list: never
  render: always
---

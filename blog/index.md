---
layout: home
title: "欢迎来到我的博客"
---

# 欢迎！

这里是我的个人博客，主要分享学习笔记和生活感悟。

## 最新文章

{% for post in site.posts limit:5 %}
- [{{ post.title }}]({{ post.url }}) - {{ post.date | date: "%Y年%m月%d日" }}
{% endfor %}

[查看所有文章](/archive.html) | [关于我](/about.html)

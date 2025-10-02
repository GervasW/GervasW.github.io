---
layout: default
title: 首页
---

<h2>最新文章</h2>

<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a> 
      - {{ post.date | date: "%Y年%m月%d日" }}
    </li>
  {% endfor %}
</ul>

---
layout: default
title: "王维的博客"
description: "记录思考、学习与成长"
---

<div class="hero">
    <h1>欢迎来到王维的博客</h1>
    <p>这里是我分享想法和学习心得的地方</p>
</div>

<div class="post-list">
    <h2>最新文章</h2>
    
    <!-- 调试信息 -->
    <!-- 找到的文章数量: {{ site.posts.size }} -->
    
    {% if site.posts.size > 0 %}
        {% for post in site.posts %}
        <article class="post-item">
            <h3 class="post-title">
                <a href="{{ post.url }}">{{ post.title }}</a>
            </h3>
            <div class="post-meta">
                <time datetime="{{ post.date | date_to_xmlschema }}">
                    {{ post.date | date: "%Y年%m月%d日" }}
                </time>
                {% if post.categories %}
                <span class="post-category">{{ post.categories | first }}</span>
                {% endif %}
            </div>
            <div class="post-excerpt">
                {% if post.excerpt %}
                    {{ post.excerpt }}
                {% else %}
                    {{ post.content | strip_html | truncate: 150 }}
                {% endif %}
            </div>
        </article>
        {% endfor %}
    {% else %}
        <div class="no-posts">
            <h3>暂无文章</h3>
            <p>看起来还没有发布任何文章。</p>
            <div class="debug-info">
                <h4>调试信息：</h4>
                <ul>
                    <li>配置 baseurl: {{ site.baseurl }}</li>
                    <li>配置 url: {{ site.url }}</li>
                    <li>文章目录: _posts/</li>
                    <li>当前时间: {{ site.time | date: "%Y-%m-%d" }}</li>
                </ul>
                <p>请确保：</p>
                <ol>
                    <li>在 <code>_posts</code> 目录中有 Markdown 文件</li>
                    <li>文件名格式为 <code>YYYY-MM-DD-title.md</code></li>
                    <li>文件包含正确的 Front Matter</li>
                    <li>文章日期不是未来日期</li>
                </ol>
            </div>
        </div>
    {% endif %}
</div>

<style>
.hero {
    text-align: center;
    padding: 3rem 0;
    margin-bottom: 3rem;
    border-bottom: 1px solid #eaeaea;
}

.hero h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #2c3e50;
}

.hero p {
    font-size: 1.2rem;
    color: #666;
}

.post-list {
    margin-bottom: 3rem;
}

.post-list h2 {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    color: #2c3e50;
    border-bottom: 2px solid #3498db;
    padding-bottom: 0.5rem;
}

.post-item {
    background: #f8f9fa;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    border-radius: 8px;
    border: 1px solid #eaeaea;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.post-item:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.post-title {
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
}

.post-title a {
    color: #2c3e50;
    text-decoration: none;
}

.post-title a:hover {
    color: #3498db;
}

.post-meta {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 0.8rem;
    display: flex;
    align-items: center;
    gap: 1rem;
}

.post-category {
    background: #3498db;
    color: white;
    padding: 0.2rem 0.6rem;
    border-radius: 12px;
    font-size: 0.8rem;
}

.post-excerpt {
    color: #555;
    line-height: 1.6;
}

.no-posts {
    background: #fff3cd;
    border: 1px solid #ffeaa7;
    border-radius: 8px;
    padding: 2rem;
    text-align: center;
    color: #856404;
}

.debug-info {
    text-align: left;
    max-width: 500px;
    margin: 1rem auto;
    background: white;
    padding: 1rem;
    border-radius: 4px;
}

.debug-info ul, .debug-info ol {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
}

.debug-info code {
    background: #f8f9fa;
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: monospace;
}

@media (max-width: 768px) {
    .hero h1 {
        font-size: 2rem;
    }
    
    .post-meta {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }
}
</style>
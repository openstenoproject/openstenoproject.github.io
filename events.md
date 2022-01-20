---

title: Events
description: Open Steno Events
layout: post
---

{% for event in site.events reversed %}

<h3>{{event.title}}</h3>

<i class="fa-calendar-o fa fa-fw"></i> {{event.date | date: "%-d %B %Y, at %H:%M %Z" }}
<br>
<i class="fa-map-marker fa fa-fw"></i> {{event.location}}

{{event.content}}

{% endfor %}

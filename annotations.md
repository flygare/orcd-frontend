# Annotations

## Add annotations to Graphite with curl
  curl -X POST http://\<ip>:\<port>/events/ -d '{"what": "Title", "tags": "tag1, tag2", "data" : "data"}'
  - what: title
  - tags: add tags
  - data: data
  - when: time(unix timestamp). when is an optional key which is set to the current Unix timestamp if when is not set.
  
  Source: http://graphite.readthedocs.io/en/latest/events.html

## Show annotations in grafana
  1. To open the annotations panel, click the settings icon in the top bar and select Annotations.
  2. Set the datasource to ‘you source’ and use the ‘Graphite event tags’ input box to filter annotiations by tags. Leave empty to find all annotations.
  - When you have added an annotation, a checkbox will appear in the top of grafana. With this checkbox you can turn the annotation s on and off.
 
 Source: https://www.hostedgraphite.com/docs/advanced/annotations-and-events.html#grafana-annotations
  
## Update and remove events
  Use the Graphite admin page to update or remove events.
  
  Link: http://\<ip>:\<port>/admin/events/event/

<?php

add_action('rest_api_init', 'universityRegisterSearch');

function universityRegisterSearch() {
  register_rest_route('university/v1', 'search', array(
    'methods' => WP_REST_SERVER::READABLE,
    'callback' => 'universitySearchResults'
  ));
}

function universitySearchResults($data) {
  $searchQuery = new WP_QUERY(array(
    'post_type' => array('post', 'page', 'professor', 'program', 'event', 'campus'),
    's' => sanitize_text_field($data['term'])
  ));

  $results = array(
    'generalInfo' => array(),
    'professors' =>array(),
    'programs' =>array(),
    'events' =>array(),
    'campuses' => array()
  );

  while ($searchQuery->have_posts()) {
    $searchQuery->the_post();

    if (get_post_type() == 'post' OR get_post_type() == 'page') {
      array_push($results['generalInfo'], array(
        'authorName' => get_the_author(),
        'postType' => get_post_type(),
        'title' => get_the_title(),
        'permalink' => get_the_permalink()
      ));
    } else if (get_post_type() == 'professor') {
      array_push($results['professors'], array(
        'title' => get_the_title(),
        'permalink' => get_the_permalink(),
        'image' => get_the_post_thumbnail_url(0,'professorLandscape')
      ));
    } else if (get_post_type() == 'program') {
      array_push($results['programs'], array(
        'title' => get_the_title(),
        'permalink' => get_the_permalink()
      ));
    } else if (get_post_type() == 'event') {
      $eventDate = new DateTime(get_field('event_date'));
      $desc = null;
      if (has_excerpt()){ $desc = get_the_excerpt(); } else { $desc = wp_trim_words(get_the_content(), 18); } 

      array_push($results['events'], array(
        'title' => get_the_title(),
        'permalink' => get_the_permalink(),
        'month' => $eventDate->format('M'),
        'day' => $eventDate->format('d'),
        'desc' => $desc
      ));
    } else if (get_post_type() == 'campus') {

      array_push($results['campuses'], array(
        'title' => get_the_title(),
        'permalink' => get_the_permalink()
      ));
    }
  }

  $programRelationshipQuery = new WP_QUERY(array(
    'post_type' => 'professor',
    'meta_query' => array(
      array(
        'key' => 'related_programs',
        'compare' => 'LIKE',
        'value' => '"67"'
      )
    )
  ));

  while ($programRelationshipQuery->have_posts()) {
    $programRelationshipQuery->the_post();

    if (get_post_type() == 'professor') {
      array_push($results['professors'], array(
        'title' => get_the_title(),
        'permalink' => get_the_permalink(),
        'image' => get_the_post_thumbnail_url(0,'professorLandscape')
      ));
    }
  }

  $results['professors'] = array_values(array_unique($results['professors'], SORT_REGULAR));

  return $results;
}
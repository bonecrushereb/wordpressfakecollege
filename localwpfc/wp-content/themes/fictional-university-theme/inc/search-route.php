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

  $searchResults = array(
    'generalInfo' => array(),
    'professors' =>array(),
    'programs' =>array(),
    'events' =>array(),
    'campuses' => array()
  );

  while ($searchQuery->have_posts()) {
    $searchQuery->the_post();

    if (get_post_type() == 'post' OR get_post_type() == 'page') {
      array_push($searchResults['generalInfo'], array(
        'title' => get_the_title(),
        'permalink' => get_the_permalink()
      ));
    } else if (get_post_type() == 'professor') {
      array_push($searchResults['professors'], array(
        'title' => get_the_title(),
        'permalink' => get_the_permalink()
      ));
    } else if (get_post_type() == 'program') {
      array_push($searchResults['programs'], array(
        'title' => get_the_title(),
        'permalink' => get_the_permalink()
      ));
    } else if (get_post_type() == 'event') {
      array_push($searchResults['events'], array(
        'title' => get_the_title(),
        'permalink' => get_the_permalink()
      ));
    } else if (get_post_type() == 'campus') {
      array_push($searchResults['campuses'], array(
        'title' => get_the_title(),
        'permalink' => get_the_permalink()
      ));
    }
  }

  return $searchResults;
}
package com.springboot;


import javax.persistence.Entity;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity // This tells Hibernate to make a table out of this class
public class MovieUser {
  @Id
  @GeneratedValue(strategy=GenerationType.AUTO)
  private String userId;
  
  private String movieId;
  
  private String movieTitle;

  public String getUserId() {
    return this.userId;
  }
  
  public void setUserId(String id) {
	    this.userId = id;
  }
  
  public String getMovieId() {
    return this.movieId;
  }
  
  public void setMovieId(String id) {
	    this.movieId = id;
  }
  
  public String getMovieTitle() {
    return this.movieTitle;
  }
  
  public void setMovieTitle(String title) {
	    this.movieTitle = title;
  }
}
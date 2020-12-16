package com.springboot.message;

import java.util.List;

public class MovieResponse {
	  private String status;
	  private List<String> data;
	  private String movieId;
	  
	  public MovieResponse(){
	    
	  }
	  
	  public MovieResponse(String status, List<String> data){
	    this.status = status;
	    this.data = data;
	  }
	 
	  public String getStatus() {
	    return status;
	  }
	 
	  public void setStatus(String status) {
	    this.status = status;
	  }
	 
	  public List<String> getData() {
	    return data;
	  }
	 
	  public void setData(List<String> data) {
	    this.data = data;
	  }
	  
	  public String getMovieId() {
	    return this.movieId;
	  }
	  
	  public void setMovieId(String id) {
		    this.movieId = id;
	  }
	}
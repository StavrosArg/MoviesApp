package com.springboot.message;

import com.springboot.Users;

public class Response {
	  private String status;
	  private Users data;
	  
	  public Response(){
	    
	  }
	  
	  public Response(String status, Users data){
	    this.status = status;
	    this.data = data;
	  }
	 
	  public String getStatus() {
	    return status;
	  }
	 
	  public void setStatus(String status) {
	    this.status = status;
	  }
	 
	  public Users getData() {
	    return data;
	  }
	 
	  public void setData(Users data) {
	    this.data = data;
	  }
	}
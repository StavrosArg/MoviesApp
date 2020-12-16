package com.springboot;

import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Repository;
import org.springframework.jdbc.core.JdbcTemplate;

@Repository
public class UserRepository  {
	
	@Autowired
	JdbcTemplate JdbcTemplate;
	

	public boolean CheckUserForLogIn(String name, String pass) {
		String userPass = null;
		String sql = "SELECT password FROM users WHERE username='"+ name +"'";
		try {
		userPass = (String) JdbcTemplate.queryForObject(
	            sql, String.class);
		 
		if (userPass.equals(pass)){

			return true;
		}

		return false;
		} catch (EmptyResultDataAccessException e) {
			return false;
		}
	}
	
	public boolean CheckUserForRetrieve(String id) {
		String userPass = null;
		String sql = "SELECT 1 FROM users WHERE Id='"+ id +"'";
		try {
		userPass = (String) JdbcTemplate.queryForObject(
	            sql, String.class);
		 
		if (userPass != ""){

			return true;
		}

		return false;
		} catch (EmptyResultDataAccessException e) {
			return false;
		}
	}
	
	public String RetrieveUserId(String name, String pass) {
		String userId = null;
		String sql = "SELECT id FROM users WHERE username='"+ name +"' AND password='" + pass + "'";
		try {
			userId = (String) JdbcTemplate.queryForObject(
	            sql, String.class);
		 
		if (userId != null){

			return userId;
		}

		return "";
		} catch (EmptyResultDataAccessException e) {
			return "";
		}
	}

	public String ImportUser(Users users) {

		if (!users.getUsername().isEmpty() && !users.getPassword().isEmpty()){
		String sql = "SELECT username FROM users WHERE username='"+ users.getUsername() +"'";
		try {
		String usernameFromDB = (String) JdbcTemplate.queryForObject(
	            sql, String.class);
		 
		if (usernameFromDB.equals( users.getUsername())){

			return "UserExists";
		}

		
		} catch (EmptyResultDataAccessException e) {
			JdbcTemplate.update(
				    "INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
				    users.getUsername(), users.getPassword() , users.getEmail()
				);
			
			return "success";
			
			}
		
		}else {
			return "invalid";
		}
		
		return "invalid";	
	}
	
	public String CheckMail(Users users) {

		if (!users.getUsername().isEmpty() && !users.getPassword().isEmpty()){
		String sql = "SELECT Email FROM users WHERE email='"+ users.getEmail() +"'";
		try {
		String emailFromDB = (String) JdbcTemplate.queryForObject(
	            sql, String.class);
			
		if (emailFromDB.equals( users.getEmail().toString())){
			return "EmailExists";
		}

		} catch (EmptyResultDataAccessException e) {
			
			return "success";
			
		}
		
		}
		else {
			
			return "success";
		}
		
		return "invalid";
	}
}
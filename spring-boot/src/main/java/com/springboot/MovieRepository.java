package com.springboot;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Repository;
import org.springframework.jdbc.core.JdbcTemplate;


@Repository
public class MovieRepository  {
	
	@Autowired
	JdbcTemplate JdbcTemplate;
	

	public List<String> RetrieveMovies(String userId) {
		List<String> movieList = new ArrayList<String> ();
		String sql = "SELECT movieId FROM favorites WHERE userId='"+ userId +"'";
		  try { 
			List<String> queryForList = (List<String>)JdbcTemplate.queryForList(sql, String.class);
			movieList = queryForList; 

			return movieList;
		} catch (EmptyResultDataAccessException e) {
			return movieList;
		}
	}
	
	public List<String> SearchMovies(String movieTitle) {
		List<String> movieList = new ArrayList<String> ();
		String sql = "SELECT movieId FROM favorites WHERE movieTitle like ('%"+ movieTitle +"%')";
		  try { 
			List<String> queryForList = (List<String>)JdbcTemplate.queryForList(sql, String.class);
			movieList = queryForList; 

			return movieList;
		} catch (EmptyResultDataAccessException e) {
			return movieList;
		}
	}
	
	public String AddMovie(String movieId, String movieTitle, String userId) {
		
		String sql = "INSERT INTO favorites VALUES ('"+ userId +"','" + movieId + "','" + movieTitle + "')";
		  try { 
			JdbcTemplate.execute(sql);
			
			return "success";
		} catch (DataAccessException e) {
			return "fail";
		}
	}
	
	public String DeleteMovie(String movieId, String userId) {
		String sql = "DELETE FROM favorites WHERE userId='"+ userId +"' AND movieId='" + movieId + "'";
		  try { 
			JdbcTemplate.execute(sql);
			
			return "success";
		} catch (DataAccessException e) {
			return "fail";
		}
	}
	
	public String RetrieveSql(String userId) {
		
		String sql = "SELECT movieId FROM favorites WHERE userId='"+ userId +"'";
		  try { 
			//String queryForObject = (String)JdbcTemplate.queryForObject( sql, String.class);
			

			return sql;
		} catch (EmptyResultDataAccessException e) {
			return sql;
		}
	}
	
	/*
	 * public String RetrieveUserId(String name, String pass) { String userId =
	 * null; String sql = "SELECT id FROM users WHERE username='"+ name
	 * +"' AND password='" + pass + "'"; try { userId = (String)
	 * JdbcTemplate.queryForObject( sql, String.class);
	 * 
	 * if (userId != null){
	 * 
	 * return userId; }
	 * 
	 * return ""; } catch (EmptyResultDataAccessException e) { return ""; } }
	 * 
	 * public String ImportUser(Users users) {
	 * 
	 * if (!users.getUsername().isEmpty() && !users.getPassword().isEmpty()){ String
	 * sql = "SELECT username FROM users WHERE username='"+ users.getUsername()
	 * +"'"; try { String usernameFromDB = (String) JdbcTemplate.queryForObject(
	 * sql, String.class);
	 * 
	 * if (usernameFromDB.equals( users.getUsername())){
	 * 
	 * return "UserExists"; }
	 * 
	 * 
	 * } catch (EmptyResultDataAccessException e) { JdbcTemplate.update(
	 * "INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
	 * users.getUsername(), users.getPassword() , users.getEmail() ); return
	 * "success";
	 * 
	 * }
	 * 
	 * }else { return "invalid"; }
	 * 
	 * 
	 * 
	 * return "invalid";
	 * 
	 * 
	 * }
	 */
		
			
}
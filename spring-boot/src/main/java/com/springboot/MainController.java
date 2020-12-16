package com.springboot;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;
import java.awt.PageAttributes.MediaType;
import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.apache.http.HttpStatus;
import org.json.simple.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.springboot.UserRepository;
import com.springboot.message.MovieResponse;
import com.springboot.message.Response;
@RestController
public class MainController {

	@Autowired	
	UserRepository userRepository;
	
	@ResponseBody
	@RequestMapping(value="/login", method = RequestMethod.GET)
    public Response Login(ModelMap model, @RequestParam(required=false,name="username") String username, @RequestParam(required=false,name="password") String password){

		boolean  isValidUser = userRepository.CheckUserForLogIn(username, password);
		Response responseData = new Response();
		Users user = new Users();
        if (!isValidUser) {
        	responseData.setStatus("fail");
        	user.setPassword(password);
        	user.setUsername(username);
            responseData.setData(user);
        	return responseData;
        }
        int userId = Integer.parseInt(userRepository.RetrieveUserId(username, password));
        user.setUsername(username);
        user.setId(userId);
        responseData.setStatus("success");
        responseData.setData(user);
        return responseData;
    }
	
	@RequestMapping(value = "/account", method = RequestMethod.POST)
	public Response CreateUser(@RequestBody Users user, BindingResult result, Model model) {
		
		 String checkMail = userRepository.CheckMail(user);
		 
		 Users newUser = new Users();
		 Response responseData = new Response();
		 
		 if (checkMail.equals("success")) {
			 String check = userRepository.ImportUser(user);
			 if(check.equals("success")) {
				 newUser.setUsername(user.getUsername());
				 newUser.setPassword(user.getPassword());
				 int userId = Integer.parseInt(userRepository.RetrieveUserId(user.getUsername(), user.getPassword()));
				 newUser.setId(userId);
			     responseData.setStatus("success");
			     responseData.setData(newUser);
				 return responseData;
			 }
			 else if (check.equals("UserExists")) {
				 newUser.setUsername(user.getUsername());
				 newUser.setPassword(user.getPassword());
				 int userId = Integer.parseInt(userRepository.RetrieveUserId(newUser.getUsername(), newUser.getPassword()));
				 newUser.setId(userId);
			     responseData.setStatus("userExists");
			     responseData.setData(newUser);
				 return responseData;	 
			 }
		 }
		 else if (checkMail.equals("EmailExists")) {
			 newUser.setUsername(user.getUsername());
			 newUser.setPassword(user.getPassword());
			 int userId = Integer.parseInt(userRepository.RetrieveUserId(newUser.getUsername(), newUser.getPassword()));
			 newUser.setId(userId);
		     responseData.setStatus("emailExists");
		     responseData.setData(newUser);
			 return responseData;	 
		 }
		 responseData.setStatus("fail");
		 responseData.setData(newUser);
		 return responseData;	
	}
	
	@Autowired	
	MovieRepository movieRepository;

	@RequestMapping(value = "/favoriteMovies", method = RequestMethod.GET)
	public MovieResponse RetrieveFavouriteMovies(@RequestParam(required=false,name="userId")String userId) 
	{
		boolean  isValidUser = userRepository.CheckUserForRetrieve(userId);
		String sql = movieRepository.RetrieveSql(userId);
		List<String> movieList = movieRepository.RetrieveMovies(userId);
		MovieResponse movieResponseData = new MovieResponse();
        if (!isValidUser) {
        	movieResponseData.setStatus("fail user");
        	
        	return movieResponseData;
        }
        movieResponseData.setStatus("success");
        movieResponseData.setData(movieList);
        return movieResponseData;
    }
	
	@RequestMapping(value = "/searchMovies", method = RequestMethod.GET)
	public MovieResponse SearchFavouriteMovies(@RequestParam(required=false,name="movieTitle")String movieTitle) 
	{
		List<String> movieList = movieRepository.SearchMovies(movieTitle);
		MovieResponse movieResponseData = new MovieResponse();
        
        movieResponseData.setStatus("success");
        movieResponseData.setData(movieList);
        return movieResponseData;
    }
	
	@RequestMapping(value = "/favoriteMovies", method = RequestMethod.POST)
	public MovieResponse AddFavouriteMovie(@RequestBody MovieUser object) 
	{
		String movieTitle = object.getMovieTitle().replace("'", "`");
		boolean  isValidUser = userRepository.CheckUserForRetrieve(object.getUserId());
		String sql = movieRepository.RetrieveSql(object.getUserId());
		String result = movieRepository.AddMovie(object.getMovieId(), movieTitle, object.getUserId());
		MovieResponse movieResponseData = new MovieResponse();
        if (!isValidUser) {
        	movieResponseData.setStatus("fail user");
        	return movieResponseData;
        }
        else if(result == "fail") {
        	movieResponseData.setStatus("fail" + movieTitle);
        	return movieResponseData;
        }
        movieResponseData.setStatus("success");
        movieResponseData.setMovieId(object.getMovieId());
        return movieResponseData;
    }
	
	@RequestMapping(value = "/favoriteMovies", method = RequestMethod.DELETE)
	public MovieResponse DeleteFavouriteMovie(@RequestBody MovieUser object) 
	{
		boolean  isValidUser = userRepository.CheckUserForRetrieve(object.getUserId());
		String sql = movieRepository.RetrieveSql(object.getUserId());
		String result = movieRepository.DeleteMovie(object.getMovieId(), object.getUserId());
		MovieResponse movieResponseData = new MovieResponse();
        if (!isValidUser) {
        	movieResponseData.setStatus("fail user");
        	return movieResponseData;
        }
        else if(result == "fail") {
        	movieResponseData.setStatus("fail");
        	return movieResponseData;
        }
        movieResponseData.setStatus("success");
        movieResponseData.setData(movieRepository.RetrieveMovies(object.getUserId()));
        return movieResponseData;
    }
}
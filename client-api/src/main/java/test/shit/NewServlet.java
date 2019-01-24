package test.shit;


import javax.inject.Inject;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/cdiservlet")
public class NewServlet extends HttpServlet {

	@Inject
	private Message messageB;

//	@Override
//	public void init() {
//		messageB = new MessageB();
//	}

	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		response.getWriter().write(messageB.get());
	}
}
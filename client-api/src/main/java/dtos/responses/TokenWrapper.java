package dtos.responses;

public class TokenWrapper {

	public String accessToken;

	public String tokenType;

	public long expiresIn;

	public String roles;

	public TokenWrapper(String accessToken, String tokenType, long expiresIn, String roles) {
		this.accessToken = accessToken;
		this.tokenType = tokenType;
		this.expiresIn = expiresIn;
		this.roles = roles;
	}

	public TokenWrapper() {
	}
}


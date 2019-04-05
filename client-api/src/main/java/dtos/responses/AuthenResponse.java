package dtos.responses;

import dtos.Credentials;
import entities.ContractorEntity;

public class AuthenResponse {
	public TokenWrapper tokenWrapper;
	public TokenContractorResponse contractor;
	public String username;


	public TokenWrapper getTokenWrapper() {
		return tokenWrapper;
	}

	public void setTokenWrapper(TokenWrapper tokenWrapper) {
		this.tokenWrapper = tokenWrapper;
	}

	public TokenContractorResponse getContractor() {
		return contractor;
	}

	public void setContractor(TokenContractorResponse contractor) {
		this.contractor = contractor;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}
}

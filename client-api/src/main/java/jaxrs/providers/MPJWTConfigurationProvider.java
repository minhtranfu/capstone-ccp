package jaxrs.providers;

import javax.enterprise.inject.Produces;
import java.security.KeyFactory;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.util.Optional;
import org.apache.tomee.microprofile.jwt.config.JWTAuthContextInfo;
import utils.TokenUtil;

public class MPJWTConfigurationProvider {
	public static final String ISSUED_BY = "/oauth2/token";

	@Produces
	Optional getOptionalContextInfo() throws Exception {
		JWTAuthContextInfo contextInfo = new JWTAuthContextInfo();

		// todo use MP Config to load the configuration
		contextInfo.setIssuedBy(ISSUED_BY);

//		byte[] encodedBytes = TokenUtil.readPublicKey("/publicKey.pem").getEncoded();
		byte[] encodedBytes = TokenUtil.readPublicKey("/publicKey.pem").getEncoded();

		final X509EncodedKeySpec spec = new X509EncodedKeySpec(encodedBytes);
		final KeyFactory kf = KeyFactory.getInstance("RSA");
		final RSAPublicKey pk = (RSAPublicKey) kf.generatePublic(spec);
		contextInfo.setSignerKey(pk);

		//time after expired time while token still accepted
		contextInfo.setExpGracePeriodSecs(10);
		return Optional.of(contextInfo);
	}

	@Produces
	JWTAuthContextInfo getContextInfo() throws Exception {
		return (JWTAuthContextInfo) getOptionalContextInfo().get();
	}
}

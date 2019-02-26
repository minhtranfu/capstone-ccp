package jaxrs.providers;

import javax.json.bind.Jsonb;
import javax.json.bind.JsonbBuilder;
import javax.json.bind.JsonbConfig;
import javax.json.bind.annotation.JsonbDateFormat;
import javax.ws.rs.ext.ContextResolver;
import javax.ws.rs.ext.Provider;
import java.util.Locale;

@Provider
public class JSONBConfiguration implements ContextResolver<Jsonb> {
	private Jsonb jsonb;

	public JSONBConfiguration() {
		// jsonbConfig offers a lot of configurations.
		JsonbConfig config = new JsonbConfig()
				.withDateFormat(JsonbDateFormat.TIME_IN_MILLIS, Locale.ENGLISH);





		jsonb = JsonbBuilder.create(config);
	}

	@Override
	public Jsonb getContext(Class<?> aClass) {
		return jsonb;
	}
}

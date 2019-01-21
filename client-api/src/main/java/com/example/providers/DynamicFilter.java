package com.example.providers;

import javax.ws.rs.container.DynamicFeature;
import javax.ws.rs.container.ResourceInfo;
import javax.ws.rs.core.FeatureContext;

//@Provider
public class DynamicFilter implements DynamicFeature {
    public void configure(ResourceInfo resourceInfo, FeatureContext featureContext) {
//        if (UserResource.class.equals(resInfo.getResourceClass()) &&
//                resInfo.getResourceMethod().getName().contains("PUT")) {
//            featureContext.register(CorsFilter.class);
//        }
    }
}

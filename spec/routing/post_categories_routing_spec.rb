require "spec_helper"

describe PostCategoriesController do
  describe "routing" do

    it "routes to #index" do
      get("/post_categories").should route_to("post_categories#index")
    end

    it "routes to #new" do
      get("/post_categories/new").should route_to("post_categories#new")
    end

    it "routes to #show" do
      get("/post_categories/1").should route_to("post_categories#show", :id => "1")
    end

    it "routes to #edit" do
      get("/post_categories/1/edit").should route_to("post_categories#edit", :id => "1")
    end

    it "routes to #create" do
      post("/post_categories").should route_to("post_categories#create")
    end

    it "routes to #update" do
      put("/post_categories/1").should route_to("post_categories#update", :id => "1")
    end

    it "routes to #destroy" do
      delete("/post_categories/1").should route_to("post_categories#destroy", :id => "1")
    end

  end
end

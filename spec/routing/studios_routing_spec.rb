require "spec_helper"

describe StudiosController do
  describe "routing" do

    it "routes to #index" do
      get("/studios").should route_to("studios#index")
    end

    it "routes to #new" do
      get("/studios/new").should route_to("studios#new")
    end

    it "routes to #show" do
      get("/studios/1").should route_to("studios#show", :id => "1")
    end

    it "routes to #edit" do
      get("/studios/1/edit").should route_to("studios#edit", :id => "1")
    end

    it "routes to #create" do
      post("/studios").should route_to("studios#create")
    end

    it "routes to #update" do
      put("/studios/1").should route_to("studios#update", :id => "1")
    end

    it "routes to #destroy" do
      delete("/studios/1").should route_to("studios#destroy", :id => "1")
    end

  end
end

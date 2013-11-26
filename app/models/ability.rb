class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new # guest user (not logged in)
    
    # Define abilities for the passed in user here. For example:
    #
    if user.admin?
      can :manage, :all
    else
      can :read, :all
    end
    end
end
    #elsif user.product_admin?
    #  can :manage, [Product, Asset, Issue]
    #elsif user.product_team?
    #  can :read, [Product, Asset]
    #  # manage products, assets he owns
    #  can :manage, Product do |product|
    #    product.try(:owner) == user
    #  end
    #  can :manage, Asset do |asset|
    #    asset.assetable.try(:owner) == user
    #  end
    
    # The first argument to `can` is the action you are giving the user permission to do.
    # If you pass :manage it will apply to every action. Other common actions here are
    # :read, :create, :update and :destroy.
    #
    # The second argument is the resource the user can perform the action on. If you pass
    # :all it will apply to every resource. Otherwise pass a Ruby class of the resource.
    #
    # The third argument is an optional hash of conditions to further filter the objects.
    # For example, here the user can only update published articles.
    #
    #   can :update, Article, :published => true
    #
    # See the wiki for details: https://github.com/ryanb/cancan/wiki/Defining-Abilities
  

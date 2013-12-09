json.array!(@studios) do |studio|
  json.extract! studio, :name
  json.url studio_url(studio, format: :json)
end

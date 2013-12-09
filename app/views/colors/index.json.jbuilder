json.array!(@colors) do |color|
  json.extract! color, :name, :hexcode
  json.url color_url(color, format: :json)
end

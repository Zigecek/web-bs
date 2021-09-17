fetch("/assets/js/config.json")
  .then(response => response.json())
  .then(config => {
    $('#contact-github').attr('href', config.socials.githubLink).html(config.socials.githubName);
    $('#contact-instagram').attr('href', config.socials.instagramLink).html(config.socials.instagramTag);
    $('#contact-discordTag').html(config.socials.discordTag);
    $('#contact-discordLink').attr('href', config.socials.discordLink).html(config.socials.discordLink);
    $('#contact-email').attr('href', `mailto:${config.socials.email}`).html(config.socials.email);
    $('#contact-steam').attr('href', config.socials.steamLink).html(config.socials.steamName);
    $('#contact-twitter').attr('href', config.socials.twitterLink).html(config.socials.twitterName);
    $('#contact-facebook').attr('href', config.socials.facebookLink).html(config.socials.facebookName);
    $('#contact-reddit').attr('href', config.socials.redditLink).html(config.socials.redditName);
    $('#contact-twitch').attr('href', config.socials.twitchLink).html(config.socials.twitchName);
    $('#contact-youtube').attr('href', config.socials.youtubeLink).html(config.socials.youtubeName);
  });
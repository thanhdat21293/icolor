<template>
	<div class="container">
	<myheader :users="users" :islogin="islogin" :searchable="searchable"></myheader>
		<div id="container-color" v-if="collection" class="container">
			<div class="row">
				<div class="col-sm-2 info">
					<div class="footer"><span><h3>{{collection.name}}</h3></span></div>
					<div class="box-author"><span><i class="fa fa-user" aria-hidden="true"></i>Author : {{collection.author}}</span></div>
					<!--<div class="box-email"><span><i class="fa fa-envelope-o" aria-hidden="true"></i> Email : {{collection.author_email}}</span></div>-->
					<div class="box-like-dislike-share">
						<span class="box-like" v-on:click.stop.prevent="likedislike(collection.id, 1)">
							<i class="fa fa-thumbs-up" aria-hidden="true" v-if="collection.currentAction === 1"></i>
                        	<i class="fa fa-thumbs-o-up" aria-hidden="true" v-else></i>
							{{ collection.like }}
						</span>
						<span class="box-dislike" v-on:click.stop.prevent="likedislike(collection.id, 0)">
							<i class="fa fa-thumbs-down" aria-hidden="true" v-if="collection.currentAction === 0"></i>
                        <i class="fa fa-thumbs-o-down" aria-hidden="true" v-else></i>
							{{ collection.dislike }}
						</span>
					</div>
					<div class="box-date"><span><i class="fa fa-calendar" aria-hidden="true"></i>Updated {{collection.date}}</span></div>
					<div class="box-share">
                        <i class="fa fa-share-alt" aria-hidden="true"></i> Share </br>

						<div class="fb-share-button" :data-href="urlCurrent" data-layout="button_count" data-size="small" data-mobile-iframe="true">
							<a class="fb-xfbml-parse-ignore" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fplugins%2F&amp;src=sdkpreparse">Chia sẻ</a>
						</div>

						<div class="g-plusone" data-size="medium" :data-href="urlCurrent"></div>
                        <!--<a id="facebook" class="social" target="_blank" onclick="shareSocial('facebook', 600,300)" :href="'http://www.facebook.com/sharer/sharer.php?s=100&p[url]=http://www.localhost:3000/detail/' + collection.id + '&p[images][0]=http://localhost:3000/public/img/thumbnail.png&p[title]=' + collection.name + '&p[summary]=' + collection.description" ><img src="https://simplesharebuttons.com/images/somacro/facebook.png" alt="Facebook" /></a>-->
                        <!--<a id="twitter" class="twitter-share-button social" target="_blank" onclick="shareSocial('twitter', 600,300)" :href="'https://twitter.com/share?text=' + collection.name + '&tw_p=tweetbutton&url=https://localhost:3000/detail/' + collection.id " data-show-count="false"><img src="https://simplesharebuttons.com/images/somacro/twitter.png" alt="Twitter" /></a>-->
                    </div>
					<!--</div>-->
				</div>
				<div class="box-colors col-sm-6">
					<!--<h1 class="name">{{collection.name}}</h1>-->
					<span class="colors" :style="{ backgroundColor:  collection.color1 }"  v-on:click="getRelated" :data-clipboard-text="collection.color1" v-on:click.stop.prevent="copy(collection.color1)"><i :data-clipboard-text="collection.color1" class="myclipboard" aria-hidden="true">{{collection.color1}}</i></span>
					<span class="colors" :style="{ backgroundColor:  collection.color2 }"  v-on:click="getRelated" :data-clipboard-text="collection.color2" v-on:click.stop.prevent="copy(collection.color2)"><i :data-clipboard-text="collection.color2" class="myclipboard" aria-hidden="true">{{collection.color2}}</i></span>
					<span class="colors" :style="{ backgroundColor:  collection.color3 }"  v-on:click="getRelated" :data-clipboard-text="collection.color3" v-on:click.stop.prevent="copy(collection.color3)"><i :data-clipboard-text="collection.color3" class="myclipboard" aria-hidden="true">{{collection.color3}}</i></span>
					<span class="colors" :style="{ backgroundColor:  collection.color4 }"  v-on:click="getRelated" :data-clipboard-text="collection.color4" v-on:click.stop.prevent="copy(collection.color4)"><i :data-clipboard-text="collection.color4" class="myclipboard" aria-hidden="true">{{collection.color4}}</i></span>
					<span class="colors" :style="{ backgroundColor:  collection.color5 }"  v-on:click="getRelated" :data-clipboard-text="collection.color5" v-on:click.stop.prevent="copy(collection.color5)"><i :data-clipboard-text="collection.color5" class="myclipboard" aria-hidden="true">{{collection.color5}}</i></span>
				</div>
				<!--<footerdetail :collection="collection"></footerdetail>-->
			</div>
            <related :collections="related_collection"></related>
		</div>
		<div v-else id="container-color">No colors.</div>
	</div>
</template>
<script>
    // Vue
    export default {
        data() {
            return {
				collection : {},
                related_collection : [],
				users : {},
				islogin : false,
				searchable : false,
				urlCurrent: ''
            }
        },
        methods : {
            getRelated (event) {
                let tmp = event.target.getAttribute('data-clipboard-text').slice(1);
                axios.get(`/relate?id=${tmp}&idparent=${this.collection.id}`)
                        .then(response => {
							let result = response.data;
                            this.related_collection = result.dt;
							this.users = result.users;
							this.islogin = result.islogin;
                        })
                        .catch(error => {
                            this.related_collection = [];
                        }); 
            },
			likedislike(collection_id, action ){
                axios.post('/likedislike', {
                    collection_id: collection_id,
                    action: action
                })
                    .then (response => {
                        if(response.data.error) {
                            console.log('Error');
                        }else{
                            this.collection = response.data;
                        }
                    })
                    .catch ( error => {
                        //this.dt = [];
                    });
            },
            copy(text){
                copyTextToClipboard(text);
            },
			getUrlCurrent(){
				let urlCurrent = window.location.href;
				this.urlCurrent = urlCurrent;
			}
        },
		mounted() {
            this.getUrlCurrent();
		},
        ready() {
            new Clipboard('.colors');
        }
    }
</script>
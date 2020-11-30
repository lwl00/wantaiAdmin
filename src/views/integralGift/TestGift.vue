<template>
	<div class="app-container">
        <div class="filter-container">
        	<el-upload
        		name="file"
				class="upload-demo"
				:action="testGiftAction"
				:on-preview="handlePreview"
				:on-remove="handleRemove"
				:file-list="picture.fileList2"
				:on-success="handleSuccessGift"
				list-type="picture">
				<el-button size="small" type="primary">点击上传</el-button>
				<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
			</el-upload>
        </div>
    </div>	
</template>

<script type="text/ecmascript-6">
    import { testGiftAction, getGiftId } from 'api/interface';
	export default {
        components: {
        },
        name: "TestGift",    
        data() {
            return {
                testGiftAction: testGiftAction(), // 下单返积分商品-指定商品上传excel action
            	picture: {
            		fileList2: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'},{
                        name: '1111',
                        url: '/images/201811071525062606.jpg'
                    }]
            	},

            }
        },
        beforeCreated() {

        },
        created() {
        },
        methods: {
        	//删除图片
        	handleRemove(file, fileList) {
				console.log(file, fileList);
			},
			//点击图片上传
			handlePreview(file) {
				console.log(file);
			},
        	//礼品图片上传成功
            handleSuccessGift: function(response, file, fileList) {
                console.log(fileList)
            },
            // handleList: function(value) {
            //     //console.log(this.addForm.fileList2)
            // },

            // querySearch(queryString, cb) {
            //     var restaurants = this.restaurants;
            //     var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            //     // 调用 callback 返回建议列表的数据
            //     cb(results);
            // },
            // createFilter(queryString) {
            //     return (restaurant) => {
            //         return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            //     };
            // },
            
        },
        mounted() {
        } 
    }
</script>

<style lang="scss" scoped>
	
</style>
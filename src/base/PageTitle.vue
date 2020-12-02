<template>
    <div class="pageTitle border-radius">
        <span>{{moduleName}}</span> 
    </div>
</template>

<script type="text/ecmascript-6">

export default {
    name: "Table-list",
    props: {
        moduleName: {
            type: String,
            default:''
        }      
    },    
    data() {
        return {
            
        }
    },
    methods: {
        
    } 
}   
</script>

<style lang="scss" scoped>
    .pageTitle {
        height: 55px;
        line-height: 55px;
        background-color: #fff;
        padding: 0 30px;
        font-size: 20px;
        font-weight: 500;
        text-align: left;
        margin-bottom: 20px;
        position: relative;
        :before {
            content: '';
            width: 4px;
            height: 20px;
            background-color: #ff6633;
            position: absolute;
            top: 50%;
            left: 20px;
            margin-top: -10px;
        }
    }
</style>
